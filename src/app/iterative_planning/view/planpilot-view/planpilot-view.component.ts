import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, forkJoin, map, of, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PlanPilotGraphComponent, PlanPilotGraphConnection, PlanPilotGraphTap } from '../../components/planpilot-graph/planpilot-graph.component';
import { hasPlanResult } from '../../domain/plan';
import { IterationStep } from '../../domain/iteration_step';
import { PlanPilotFacet, PlanPilotService } from '../../service/planpilot.service';
import { selectIterativePlanningProject, selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from '../../state/iterative-planning.selector';
import { buildPlanPilotViewGraphConnections } from './planpilot-graph-connections';
import { buildPlanPilotGraphDiagnostic, javascriptAssetNames, PlanPilotGraphDiagnostic } from './planpilot-graph-diagnostic';
import { evaluatePlanPilotProperties } from './planpilot-property-evaluation';
import {
  mapBackendFacet,
  mapRepresentativeSolution,
  withFacetSelectionState,
} from './planpilot-solution';
import {
  FacetFilter,
  FacetSelection,
  isStructuralPlanPilotFacet,
  PendingFacetSelection,
  PlanPilotPropertyEvaluation,
  PlanPilotUiFacet,
} from './planpilot-view.models';

@Component({
  selector: 'app-planpilot-view',
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    PageModule,
    PlanPilotGraphComponent,
    RouterLink,
  ],
  templateUrl: './planpilot-view.component.html',
  styleUrl: './planpilot-view.component.scss',
})
export class PlanPilotViewComponent implements OnInit, OnDestroy {
  private readonly facetPageSize = 40;
  private readonly initialGraphFacetLimit = 50;
  private readonly graphLimitStep = 50;
  private readonly maxSessionHorizon = 100;
  private readonly fullscreenBodyClass = 'planpilot-fullscreen-open';
  private store = inject(Store);
  private planPilotService = inject(PlanPilotService);
  private document = inject(DOCUMENT);
  private bodyOverflowBeforeFullscreen = '';
  private fullscreenScrollLocked = false;
  private destroyed = false;
  private sessionStartGeneration = 0;
  @ViewChild(PlanPilotGraphComponent) graph?: PlanPilotGraphComponent;

  project$ = this.store.select(selectIterativePlanningProject);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  solved$ = this.step$.pipe(map((step) => hasPlanResult(step?.plan)));

  facets: PlanPilotUiFacet[] = [];
  query = '';
  activeFilter: FacetFilter = 'all';
  inspectedFacetId: string | undefined;
  solutionCount = 0;
  solutionCountKnown = false;
  sessionHorizon = 0;
  canvasExpanded = false;
  activePinnedFacets: Record<string, PlanPilotUiFacet> = {};
  knownFacets: Record<string, PlanPilotUiFacet> = {};
  runId?: string;
  sessionStatus: 'idle' | 'starting' | 'ready' | 'failed' | 'stopped' = 'idle';
  sessionStep?: IterationStep;
  sessionReused = false;
  sessionEncoding: 'exact' | 'bounded' = 'bounded';
  sessionAbstractTimeSteps = false;
  activeSessionHorizon = 0;
  activeSessionEncoding: 'exact' | 'bounded' = 'bounded';
  activeSessionAbstractTimeSteps = false;
  backendError?: string;
  selectionPending = false;
  queryPending = false;
  activeOperationLabel = '';
  lastSelectionMessage = '';
  lastSpaceChangeSummary = '';
  pendingSelections: Record<string, PendingFacetSelection> = {};
  representativeSolution: PlanPilotUiFacet[] = [];
  representativeSolutionLabel = '';
  currentSolutionNumber = 0;
  solutionCache: Record<number, { label: string; facets: PlanPilotUiFacet[] }> = {};
  facetListLimit = this.facetPageSize;
  graphFacetLimit = this.initialGraphFacetLimit;
  planProperties: Record<string, PlanProperty> = {};
  propertyEvaluations: PlanPilotPropertyEvaluation[] = [];

  readonly filters: { value: FacetFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Alternatives' },
    { value: 'selected', label: 'Required' },
    { value: 'excluded', label: 'Forbidden' },
  ];

  get activeConstraints(): PlanPilotUiFacet[] {
    return this.facets.filter((facet) => this.isUserConstraint(facet));
  }

  get pendingSelectionEntries(): PendingFacetSelection[] {
    return Object.values(this.pendingSelections)
      .sort((left, right) => left.timestep - right.timestep || left.label.localeCompare(right.label));
  }

  get pendingSelectionCount(): number {
    return this.pendingSelectionEntries.length;
  }

  get displayedSessionHorizon(): number {
    return this.activeSessionHorizon || this.sessionHorizon;
  }

  get displayedSessionEncoding(): 'exact' | 'bounded' {
    return this.runId && this.activeSessionHorizon > 0
      ? this.activeSessionEncoding
      : this.sessionEncoding;
  }

  get selectedConstraintCount(): number {
    return this.facets.filter((facet) => facet.selection === 'positive' && this.isUserConstraint(facet)).length;
  }

  get excludedConstraintCount(): number {
    return this.facets.filter((facet) => facet.selection === 'negative' && this.isUserConstraint(facet)).length;
  }

  get remainingFacetCount(): number {
    const displayedPlanIds = new Set(this.representativeSolution.map((facet) => facet.id));
    return this.facets.filter((facet) => (
      facet.available
      && facet.selectable !== false
      && facet.selection === 'neutral'
      && facet.facetType !== 'implied'
      && !this.isStructuralFacet(facet)
      && !displayedPlanIds.has(facet.id)
    )).length;
  }

  get matchingFacets(): PlanPilotUiFacet[] {
    const normalizedQuery = this.query.trim().toLowerCase();
    return this.facets
      .filter((facet) => !this.isStructuralFacet(facet))
      .filter((facet) => this.matchesFilter(facet))
      .filter((facet) => !normalizedQuery || this.matchesQuery(facet, normalizedQuery))
      .sort((left, right) => this.compareFacets(left, right));
  }

  get visibleFacets(): PlanPilotUiFacet[] {
    return this.matchingFacets.slice(0, this.facetListLimit);
  }

  get hiddenListFacetCount(): number {
    return Math.max(0, this.matchingFacets.length - this.visibleFacets.length);
  }

  get graphFacets(): PlanPilotUiFacet[] {
    const baseFacets = this.facets.filter((facet) => (
      facet.nodeType === 'root' ||
      facet.available ||
      facet.selection !== 'neutral' ||
      facet.id === this.inspectedFacetId
    ));
    const solutionById = new Map(
      this.representativeSolution.map((facet) => [facet.id, facet]),
    );
    const mergedBase = baseFacets.map((facet): PlanPilotUiFacet => {
      const solutionFacet = solutionById.get(facet.id);
      return solutionFacet && facet.nodeType !== 'root'
        ? { ...facet, parentId: solutionFacet.parentId, solutionContext: true }
        : facet;
    });
    const baseIds = new Set(mergedBase.map((facet) => facet.id));
    const goalFacet = this.representativeSolution.length
      ? this.goalFacet(this.representativeSolution[this.representativeSolution.length - 1])
      : undefined;
    const merged = [
      ...mergedBase,
      ...this.representativeSolution.filter((facet) => !baseIds.has(facet.id)),
      ...(goalFacet ? [goalFacet] : []),
    ];
    if (merged.length <= this.graphFacetLimit) {
      return merged.map((facet) => this.decorateGraphFacet(facet));
    }
    const mandatory = merged.filter((facet) => (
      facet.nodeType === 'root'
      || facet.nodeType === 'goal'
      || facet.selection !== 'neutral'
      || facet.solutionContext
      || facet.id === this.inspectedFacetId
    ));
    const mandatoryIds = new Set(mandatory.map((facet) => facet.id));
    const neutralByTimestep = new Map<number, PlanPilotUiFacet[]>();
    merged
      .filter((facet) => !mandatoryIds.has(facet.id))
      .sort((left, right) => this.compareFacets(left, right))
      .forEach((facet) => {
        neutralByTimestep.set(facet.timestep, [
          ...(neutralByTimestep.get(facet.timestep) ?? []),
          facet,
        ]);
      });
    const optionalCapacity = Math.max(0, this.graphFacetLimit - mandatory.length);
    const optional = this.takeFacetsRoundRobin(neutralByTimestep, optionalCapacity);
    const visibleIds = new Set([
      ...mandatoryIds,
      ...optional.slice(0, optionalCapacity).map((facet) => facet.id),
    ]);

    return merged
      .filter((facet) => visibleIds.has(facet.id))
      .map((facet) => this.decorateGraphFacet(facet));
  }

  get totalGraphDomainFacetCount(): number {
    const ids = new Set([
      ...this.facets.filter((facet) => !this.isStructuralFacet(facet)).map((facet) => facet.id),
      ...this.representativeSolution
        .filter((facet) => !this.isStructuralFacet(facet))
        .map((facet) => facet.id),
    ]);
    return ids.size;
  }

  get displayedGraphDomainFacetCount(): number {
    return this.graphFacets.filter((facet) => !this.isStructuralFacet(facet)).length;
  }

  get hiddenGraphFacetCount(): number {
    return Math.max(0, this.totalGraphDomainFacetCount - this.displayedGraphDomainFacetCount);
  }

  get graphLimitExpanded(): boolean {
    return this.graphFacetLimit > this.initialGraphFacetLimit;
  }

  get forcedSuffixMessage(): string {
    if (this.solutionCount !== 1 || !this.representativeSolution.length) {
      return '';
    }
    const alternativeTimesteps = this.facets
      .filter((facet) => facet.available && facet.selection === 'neutral' && !this.isStructuralFacet(facet))
      .map((facet) => facet.timestep);
    const lastAlternative = alternativeTimesteps.length ? Math.max(...alternativeTimesteps) : 0;
    const forcedActions = this.representativeSolution.filter((facet) => facet.timestep > lastAlternative);
    if (!forcedActions.length) {
      return '';
    }
    return lastAlternative > 0
      ? `1 plan left. No alternatives after t${lastAlternative}.`
      : '1 plan left. No alternatives.';
  }

  get inspectedFacet(): PlanPilotUiFacet | undefined {
    const backendFacet = this.facets.find((facet) => facet.id === this.inspectedFacetId);
    const solutionFacet = this.representativeSolution.find((facet) => facet.id === this.inspectedFacetId);
    if (backendFacet && solutionFacet) {
      return {
        ...backendFacet,
        parentId: solutionFacet.parentId,
        solutionContext: true,
      };
    }
    return solutionFacet ?? backendFacet;
  }

  get graphConnections(): PlanPilotGraphConnection[] {
    const visibleDomainFacets = this.graphFacets.filter((facet) => (
      facet.nodeType !== 'root' && facet.nodeType !== 'time'
    ));
    return buildPlanPilotViewGraphConnections(visibleDomainFacets);
  }

  get dataSourceLabel(): string {
    switch (this.sessionStatus) {
      case 'starting':
        return 'Starting PlanPilot session';
      case 'ready':
        return this.sessionReused ? 'Session reused' : 'Session ready';
      case 'failed':
        return 'Unavailable';
      case 'stopped':
        return 'Session stopped';
      default:
        return 'Waiting for iteration step';
    }
  }

  get canUseSession(): boolean {
    return this.sessionStatus === 'ready' && Boolean(this.runId);
  }

  get isBusy(): boolean {
    return this.sessionStatus === 'starting' || this.selectionPending || this.queryPending;
  }

  get sessionConfigurationChanged(): boolean {
    return this.sessionHorizon !== this.activeSessionHorizon
      || this.sessionEncoding !== this.activeSessionEncoding
      || this.sessionAbstractTimeSteps !== this.activeSessionAbstractTimeSteps;
  }

  get representativeActionCount(): number {
    return this.representativeSolution.length;
  }

  get busyLabel(): string {
    if (this.sessionStatus === 'starting') {
      return 'Starting PlanPilot session';
    }
    return this.activeOperationLabel || 'PlanPilot is working';
  }

  ngOnInit(): void {
    this.store.select(selectIterativePlanningProperties)
      .pipe(
        filter((properties): properties is Record<string, PlanProperty> => Boolean(properties)),
        take(1),
      )
      .subscribe((properties) => {
        this.planProperties = properties;
        this.evaluateCurrentProperties();
      });
    this.step$
      .pipe(
        filter((step): step is IterationStep => Boolean(step?._id)),
        take(1),
      )
      .subscribe((step) => this.startSession(step));
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.sessionStartGeneration += 1;
    const runId = this.runId;
    this.runId = undefined;
    if (runId) {
      this.stopDetachedSession(runId);
    }
    this.restoreDocumentScroll();
  }

  @HostListener('document:keydown.escape')
  exitFullscreenWithEscape(): void {
    if (this.canvasExpanded) {
      this.toggleCanvasExpanded();
    }
  }

  updateQuery(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.facetListLimit = this.facetPageSize;
  }

  setFilter(filter: FacetFilter): void {
    this.activeFilter = filter;
    this.facetListLimit = this.facetPageSize;
  }

  selectFacet(facetId: string): void {
    if (!this.facets.some((facet) => facet.id === facetId && !this.isStructuralFacet(facet))) {
      return;
    }

    this.inspectedFacetId = facetId;
    setTimeout(() => this.graph?.focusFacet(facetId));
  }

  showMoreFacets(): void {
    this.facetListLimit += this.facetPageSize;
  }

  showAllFacets(): void {
    this.facetListLimit = this.matchingFacets.length;
  }

  collapseFacetList(): void {
    this.facetListLimit = this.facetPageSize;
  }

  showMoreGraphFacets(): void {
    this.graphFacetLimit += this.graphLimitStep;
    setTimeout(() => this.graph?.resizeAndFit());
  }

  showAllGraphFacets(): void {
    this.graphFacetLimit = Number.MAX_SAFE_INTEGER;
    setTimeout(() => this.graph?.resizeAndFit());
  }

  collapseGraphFacets(): void {
    this.graphFacetLimit = this.initialGraphFacetLimit;
    setTimeout(() => this.graph?.resizeAndFit());
  }

  updateSessionHorizon(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isInteger(value)) {
      this.sessionHorizon = Math.min(this.maxSessionHorizon, Math.max(1, value));
    }
  }

  updateSessionEncoding(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'bounded' || value === 'exact') {
      this.sessionEncoding = value;
    }
  }

  updateAbstractTimeSteps(event: Event): void {
    this.sessionAbstractTimeSteps = (event.target as HTMLInputElement).checked;
  }

  applySessionConfiguration(): void {
    if (!this.sessionStep || !this.sessionConfigurationChanged || this.isBusy) {
      return;
    }

    const previousRunId = this.runId;
    if (!previousRunId) {
      this.startSession(this.sessionStep);
      return;
    }

    this.startSession(this.sessionStep, previousRunId);
  }

  showSolution(solutionNumber: number): void {
    if (
      !this.runId
      || this.isBusy
      || solutionNumber < 1
      || solutionNumber > this.solutionCount
    ) {
      return;
    }

    const cached = this.solutionCache[solutionNumber];
    if (cached) {
      this.backendError = undefined;
      this.currentSolutionNumber = solutionNumber;
      this.representativeSolutionLabel = cached.label;
      this.representativeSolution = cached.facets.map((facet) => ({ ...facet }));
      this.evaluateCurrentProperties();
      setTimeout(() => this.graph?.fitGraph());
      return;
    }

    const runId = this.runId;
    this.queryPending = true;
    this.activeOperationLabel = `Loading plan ${solutionNumber}`;
    this.planPilotService.query$(runId, 'solution', solutionNumber).subscribe({
      next: (response) => {
        if (this.runId !== runId) {
          return;
        }
        const solution = response.result.solutions?.[0];
        if (!solution?.facets.length) {
          this.backendError = `Plan ${solutionNumber} is no longer available.`;
        } else {
          this.backendError = undefined;
          this.currentSolutionNumber = solutionNumber;
          this.representativeSolutionLabel = solution.label;
          this.representativeSolution = this.toRepresentativeSolution(solution.facets);
          this.evaluateCurrentProperties();
          this.solutionCache[solutionNumber] = {
            label: this.representativeSolutionLabel,
            facets: this.representativeSolution.map((facet) => ({ ...facet })),
          };
          setTimeout(() => this.graph?.fitGraph());
        }
        this.queryPending = false;
        this.activeOperationLabel = '';
      },
      error: (error) => {
        if (this.runId !== runId) {
          return;
        }
        this.backendError = this.errorMessage(error);
        this.queryPending = false;
        this.activeOperationLabel = '';
      },
    });
  }

  selectFacetFromGraph(event: PlanPilotGraphTap): void {
    if (!event.facetId) {
      return;
    }

    this.selectFacet(event.facetId);
  }

  applyFacetSelection(facetId: string, selection: FacetSelection): void {
    const facet = this.facets.find((item) => item.id === facetId);
    const canClearConstraint = selection === 'neutral' && Boolean(facet && this.canClearFacet(facet));
    if (
      !this.runId ||
      !facet ||
      facet.nodeType === 'root' ||
      (!facet.available && !canClearConstraint) ||
      this.isBusy
    ) {
      this.backendError = 'PlanPilot session is not ready.';
      return;
    }
    if (selection === 'neutral' && !canClearConstraint) {
      this.lastSelectionMessage = 'No user constraint is set for this action.';
      return;
    }
    if (selection !== 'neutral' && facet.selectable === false) {
      this.backendError = 'This action is fixed by the current plan space and cannot be required or forbidden.';
      return;
    }

    if (facet.selection === selection) {
      this.lastSelectionMessage = selection === 'neutral'
        ? 'No user constraint is set for this action.'
        : `This action is already ${selection === 'positive' ? 'required' : 'forbidden'}.`;
      return;
    }

    const previousSelection = facet.selection;
    const targetSelection = selection;
    const existingPending = this.pendingSelections[facet.id];
    const committedSelection = existingPending?.previousSelection ?? previousSelection;
    const nextPendingSelections = { ...this.pendingSelections };
    let nextFacets = this.facets;

    if (targetSelection === 'positive') {
      nextFacets = nextFacets.map((candidate) => {
        if (
          candidate.id === facet.id
          || facet.abstractTimeStep
          || candidate.abstractTimeStep
          || candidate.timestep !== facet.timestep
          || candidate.selection !== 'positive'
          || (
            !this.isUserConstraint(candidate)
            && nextPendingSelections[candidate.id]?.selection !== 'positive'
          )
        ) {
          return candidate;
        }

        const candidatePending = nextPendingSelections[candidate.id];
        const candidateCommitted = candidatePending?.previousSelection ?? candidate.selection;
        if (candidateCommitted === 'neutral') {
          delete nextPendingSelections[candidate.id];
        } else {
          nextPendingSelections[candidate.id] = {
            facetId: candidate.id,
            label: candidate.label,
            timestep: candidate.timestep,
            selection: 'neutral',
            previousSelection: candidateCommitted,
          };
        }
        return this.withSelectionState(candidate, 'neutral');
      });
    }

    if (targetSelection === committedSelection) {
      delete nextPendingSelections[facet.id];
    } else {
      nextPendingSelections[facet.id] = {
        facetId,
        label: facet.label,
        timestep: facet.timestep,
        selection: targetSelection,
        previousSelection: committedSelection,
      };
    }

    this.pendingSelections = nextPendingSelections;
    this.facets = nextFacets.map((item) => (
      item.id === facetId ? this.withSelectionState(item, targetSelection) : item
    ));
    this.inspectedFacetId = facetId;
    const stagedAction = targetSelection === 'neutral'
      ? `Clear ${facet.label}`
      : `${this.selectionLabel(targetSelection)} ${facet.label}`;
    this.lastSelectionMessage = `${stagedAction} staged. Click Apply to update the graph.`;
  }

  computeStagedSelections(): void {
    const stagedSelections = this.pendingSelectionEntries;
    if (!this.runId || stagedSelections.length === 0) {
      return;
    }

    this.selectionPending = true;
    this.activeOperationLabel = `Applying ${stagedSelections.length} staged change${stagedSelections.length === 1 ? '' : 's'}`;
    this.lastSelectionMessage = `Applying ${stagedSelections.length} change${stagedSelections.length === 1 ? '' : 's'}`;

    this.planPilotService.applyFacets$(this.runId, {
      selections: stagedSelections.map((selection) => ({
        facetId: selection.facetId,
        selectionState: selection.selection,
        previousSelectionState: selection.previousSelection,
      })),
    }).subscribe({
      next: (response) => {
        this.backendError = undefined;
        stagedSelections.forEach((selection) => {
          const facet = this.facets.find((item) => item.id === selection.facetId)
            ?? this.knownFacets[selection.facetId];
          if (facet) {
            this.updatePinnedFacet(facet, selection.selection);
          }
        });
        this.pendingSelections = {};
        this.applyBackendFacets(response.facets, true);
        this.selectionPending = false;
        this.activeOperationLabel = '';
        this.lastSelectionMessage = `${stagedSelections.length} change${stagedSelections.length === 1 ? '' : 's'} applied.`;
        this.refreshPlanSummary();
        setTimeout(() => this.graph?.fitGraph());
      },
      error: (error) => {
        if (this.isSelectionConflict(error)) {
          this.pendingSelections = {};
          this.facets = this.facets.map((facet) => {
            const staged = stagedSelections.find((selection) => selection.facetId === facet.id);
            return staged ? this.withSelectionState(facet, staged.previousSelection) : facet;
          });
          this.activePinnedFacets = {};
          this.knownFacets = {};
          this.backendError = undefined;
          this.lastSelectionMessage = 'The plan space changed. Facets were reloaded; please select your changes again.';
          this.selectionPending = false;
          this.activeOperationLabel = '';
          this.refreshFacets(true);
          return;
        }
        this.backendError = this.errorMessage(error);
        this.lastSelectionMessage = 'Changes were not applied. Review the selected actions and try again.';
        this.selectionPending = false;
        this.activeOperationLabel = '';
      },
    });
  }

  discardStagedSelections(): void {
    const stagedSelections = this.pendingSelectionEntries;
    if (stagedSelections.length === 0) {
      return;
    }

    this.pendingSelections = {};
    this.facets = this.facets.map((facet) => {
      const staged = stagedSelections.find((selection) => selection.facetId === facet.id);
      return staged ? this.withSelectionState(facet, staged.previousSelection) : facet;
    });
    this.lastSelectionMessage = 'Changes discarded.';
  }

  toggleCanvasExpanded(): void {
    this.canvasExpanded = !this.canvasExpanded;
    if (this.canvasExpanded) {
      this.bodyOverflowBeforeFullscreen = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      this.document.body.classList.add(this.fullscreenBodyClass);
      this.fullscreenScrollLocked = true;
    } else {
      this.restoreDocumentScroll();
    }
    setTimeout(() => this.graph?.resizeAndFit());
  }

  zoomIn(): void {
    this.graph?.zoomIn();
  }

  zoomOut(): void {
    this.graph?.zoomOut();
  }

  exportGraphDiagnostic(): void {
    const payload = this.buildGraphDiagnostic();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = this.document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = this.graphDiagnosticFilename(payload.generatedAt);
    anchor.style.display = 'none';
    this.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
    this.lastSelectionMessage = 'Graph data exported.';
  }

  buildGraphDiagnostic(): PlanPilotGraphDiagnostic {
    const graphFacets = this.graphFacets;
    const connections = this.graphConnections;
    return buildPlanPilotGraphDiagnostic({
      generatedAt: new Date().toISOString(),
      location: window.location.pathname,
      applicationAssets: javascriptAssetNames(
        Array.from(this.document.scripts).map((script) => script.src),
        this.document.baseURI,
      ),
      browser: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
        userAgent: window.navigator.userAgent,
      },
      iterationStep: {
        id: this.sessionStep?._id,
        name: this.sessionStep?.name,
        planStatus: this.sessionStep?.plan?.status,
        planActionCount: this.sessionStep?.plan?.actions?.length ?? 0,
      },
      session: {
        runId: this.runId,
        status: this.sessionStatus,
        reused: this.sessionReused,
        encoding: this.sessionEncoding,
        abstractTimeSteps: this.sessionAbstractTimeSteps,
        horizon: this.sessionHorizon,
        solutionCount: this.solutionCount,
        currentSolutionNumber: this.currentSolutionNumber,
        backendError: this.backendError,
      },
      ui: {
        selectedFacetId: this.inspectedFacetId,
        activeFilter: this.activeFilter,
        searchQuery: this.query,
        fullscreen: this.canvasExpanded,
        busy: this.isBusy,
        pendingSelections: this.pendingSelectionEntries,
        activePinnedFacetIds: Object.keys(this.activePinnedFacets),
        lastSelectionMessage: this.lastSelectionMessage,
        lastSpaceChangeSummary: this.lastSpaceChangeSummary,
        facetListLimit: this.facetListLimit,
        graphFacetLimit: this.graphFacetLimit,
        graphLimitExpanded: this.graphLimitExpanded,
        connectionModel: 'representative-solution-only',
        propertyEvaluations: this.propertyEvaluations,
      },
      allFacets: this.facets,
      graphFacets,
      representativeSolution: this.representativeSolution,
      connections,
      renderedGraph: this.graph?.exportSnapshot(),
    });
  }

  resetSessionView(): void {
    this.discardStagedSelections();
    const activeSelections = this.activeConstraints;
    this.activeFilter = 'all';
    this.query = '';
    this.facetListLimit = this.facetPageSize;
    this.graphFacetLimit = this.initialGraphFacetLimit;
    this.lastSpaceChangeSummary = '';

    if (this.runId && activeSelections.length) {
      this.selectionPending = true;
      this.activeOperationLabel = 'Removing constraints';
      this.lastSelectionMessage = 'Removing constraints';
      this.planPilotService.applyFacets$(this.runId, {
        selections: activeSelections.map((facet) => ({
          facetId: facet.id,
          selectionState: 'neutral',
          previousSelectionState: facet.selection,
        })),
      }).subscribe({
        next: (response) => {
          this.backendError = undefined;
          this.activePinnedFacets = {};
          this.knownFacets = {};
          this.lastSelectionMessage = 'All constraints removed.';
          this.selectionPending = false;
          this.activeOperationLabel = '';
          this.applyBackendFacets(response.facets, true);
          this.refreshPlanSummary();
          setTimeout(() => this.graph?.fitGraph());
        },
        error: (error) => {
          this.backendError = this.errorMessage(error);
          this.selectionPending = false;
          this.activeOperationLabel = '';
        },
      });
      return;
    }

    this.activePinnedFacets = {};
    this.knownFacets = {};
    this.lastSelectionMessage = '';
    if (this.runId) {
      this.refreshFacets(true);
    } else {
      setTimeout(() => this.graph?.fitGraph());
    }
  }

  stopSession(): void {
    if (!this.runId || this.selectionPending) {
      return;
    }

    const runId = this.runId;
    this.selectionPending = true;
    this.activeOperationLabel = 'Stopping PlanPilot session';
    this.lastSelectionMessage = 'Stopping PlanPilot session';
    this.planPilotService.stopSession$(runId).subscribe({
      next: () => {
        this.clearSessionState();
        this.sessionStatus = 'stopped';
        this.selectionPending = false;
        this.activeOperationLabel = '';
        this.lastSelectionMessage = 'PlanPilot session stopped';
      },
      error: (error) => {
        this.backendError = this.errorMessage(error);
        this.selectionPending = false;
        this.activeOperationLabel = '';
      },
    });
  }

  startNewSession(): void {
    if (!this.sessionStep || this.isBusy) {
      return;
    }

    this.startSession(this.sessionStep);
  }

  selectionIcon(selection: FacetSelection): string {
    switch (selection) {
      case 'positive':
        return 'add_circle';
      case 'negative':
        return 'remove_circle';
      default:
        return 'radio_button_unchecked';
    }
  }

  selectionLabel(selection: FacetSelection): string {
    switch (selection) {
      case 'positive':
        return 'Required by you';
      case 'negative':
        return 'Forbidden by you';
      default:
        return 'Available';
    }
  }

  timestepLabel(facet: PlanPilotUiFacet): string {
    return facet.abstractTimeStep ? 'Any step' : `t${facet.timestep}`;
  }

  propertyStatusLabel(property: PlanPilotPropertyEvaluation): string {
    if (property.status === 'unsupported') {
      return 'Cannot be checked from this plan';
    }
    if (property.status === 'unsatisfied') {
      return 'Not true after the final action';
    }
    return property.stableSinceTimestep === 0
      ? 'True from the start'
      : `True from t${property.stableSinceTimestep} onward`;
  }

  facetStateLabel(facet: PlanPilotUiFacet): string {
    const pending = this.pendingSelections[facet.id]?.selection;
    const inDisplayedPlan = this.isDisplayedPlanFacet(facet);
    if (pending) {
      const pendingLabel = pending === 'positive'
        ? 'Require pending'
        : pending === 'negative'
          ? 'Forbid pending'
          : 'Remove pending';
      return inDisplayedPlan ? `Displayed plan · ${pendingLabel}` : pendingLabel;
    }
    if (inDisplayedPlan) {
      return this.isUserConstraint(facet) && facet.selection === 'positive'
        ? 'Displayed plan · Required by you'
        : 'Displayed plan · No constraint';
    }
    if (facet.facetType === 'implied') {
      return 'Occurs in every plan';
    }
    if (this.isUserConstraint(facet)) {
      return this.selectionLabel(facet.selection);
    }
    if (!facet.available) {
      return 'Outside current space';
    }
    return this.selectionLabel(facet.selection);
  }

  isDisplayedPlanFacet(facet: PlanPilotUiFacet): boolean {
    return Boolean(facet.solutionContext)
      || this.representativeSolution.some((action) => action.id === facet.id);
  }

  isRequiredFacet(facet: PlanPilotUiFacet): boolean {
    return facet.selection === 'positive' && (
      this.pendingSelections[facet.id]?.selection === 'positive'
      || this.isUserConstraint(facet)
    );
  }

  isForbiddenFacet(facet: PlanPilotUiFacet): boolean {
    return facet.selection === 'negative' && (
      this.pendingSelections[facet.id]?.selection === 'negative'
      || this.isUserConstraint(facet)
    );
  }

  canRequireFacet(facet: PlanPilotUiFacet): boolean {
    return this.isBackendFacet(facet)
      && facet.available
      && facet.selectable !== false
      && facet.selection !== 'positive';
  }

  canForbidFacet(facet: PlanPilotUiFacet): boolean {
    return this.isBackendFacet(facet)
      && facet.available
      && facet.selectable !== false
      && facet.selection !== 'negative';
  }

  canClearFacet(facet: PlanPilotUiFacet): boolean {
    return this.isBackendFacet(facet)
      && facet.selection !== 'neutral'
      && facet.facetType !== 'implied'
      && (Boolean(this.pendingSelections[facet.id]) || this.isUserConstraint(facet));
  }

  clearFacetHint(facet: PlanPilotUiFacet): string {
    if (this.canClearFacet(facet)) {
      return 'Remove this user constraint';
    }
    if (facet.facetType === 'implied') {
      return 'PlanPilot found this action in every remaining plan';
    }
    return 'No user constraint is set for this action';
  }

  private matchesFilter(facet: PlanPilotUiFacet): boolean {
    if (facet.nodeType === 'root') {
      return true;
    }

    switch (this.activeFilter) {
      case 'open':
        return facet.available && facet.selectable !== false && facet.selection === 'neutral' && facet.facetType !== 'implied';
      case 'selected':
        return facet.selection === 'positive';
      case 'excluded':
        return facet.selection === 'negative';
      default:
        return true;
    }
  }

  private matchesQuery(facet: PlanPilotUiFacet, query: string): boolean {
    return [facet.label, facet.detail, facet.action, facet.group, ...facet.tokens]
      .some((value) => value.toLowerCase().includes(query));
  }

  private compareFacets(left: PlanPilotUiFacet, right: PlanPilotUiFacet): number {
    return left.timestep - right.timestep
      || this.facetDisplayPriority(left) - this.facetDisplayPriority(right)
      || (right.solutionReduction ?? -1) - (left.solutionReduction ?? -1)
      || left.label.localeCompare(right.label);
  }

  private takeFacetsRoundRobin(
    facetsByTimestep: Map<number, PlanPilotUiFacet[]>,
    limit: number,
  ): PlanPilotUiFacet[] {
    const groups = Array.from(facetsByTimestep.entries())
      .sort(([left], [right]) => left - right)
      .map(([, facets]) => facets);
    const result: PlanPilotUiFacet[] = [];
    let index = 0;

    while (result.length < limit) {
      let added = false;
      for (const group of groups) {
        const facet = group[index];
        if (facet && result.length < limit) {
          result.push(facet);
          added = true;
        }
      }
      if (!added) {
        break;
      }
      index += 1;
    }

    return result;
  }

  private facetDisplayPriority(facet: PlanPilotUiFacet): number {
    if (facet.facetType === 'implied') {
      return 2;
    }
    if (facet.facetType === 'empty') {
      return 1;
    }
    return 0;
  }

  private startSession(step: IterationStep, replacementRunId?: string): void {
    if (!hasPlanResult(step.plan)) {
      return;
    }

    this.sessionStep = step;
    if (this.sessionHorizon <= 0) {
      this.sessionHorizon = this.defaultExplorationHorizon(step);
    }
    if (!replacementRunId) {
      this.clearSessionState();
    }
    this.sessionStatus = 'starting';
    this.activeOperationLabel = replacementRunId
      ? 'Trying new plan-space settings'
      : 'Starting PlanPilot session';
    this.backendError = undefined;
    const startGeneration = ++this.sessionStartGeneration;
    this.planPilotService.startSession$({
      iterationStepId: step._id,
      horizon: this.sessionHorizon,
      encoding: this.sessionEncoding,
      abstractTimeSteps: this.sessionAbstractTimeSteps,
    }).subscribe({
      next: (response) => {
        if (this.destroyed || startGeneration !== this.sessionStartGeneration) {
          if (response.runId !== this.runId) {
            this.stopDetachedSession(response.runId);
          }
          return;
        }
        if (!response.hasPlan || !response.solution?.facets.length) {
          this.stopDetachedSession(response.runId);
          this.sessionStatus = replacementRunId ? 'ready' : 'failed';
          this.backendError = 'PlanPilot did not return a concrete plan for this configuration.';
          this.activeOperationLabel = '';
          return;
        }
        this.runId = response.runId;
        this.sessionStatus = 'ready';
        this.sessionReused = Boolean(response.reused);
        this.activeSessionHorizon = response.configuration.horizon;
        this.activeSessionEncoding = response.configuration.encoding;
        this.activeSessionAbstractTimeSteps = response.configuration.abstractTimeSteps;
        this.sessionHorizon = response.configuration.horizon;
        this.sessionEncoding = response.configuration.encoding;
        this.sessionAbstractTimeSteps = response.configuration.abstractTimeSteps;
        this.applyBackendFacets(response.facets);
        this.representativeSolutionLabel = response.solution.label;
        this.representativeSolution = this.toRepresentativeSolution(response.solution.facets);
        this.evaluateCurrentProperties();
        this.currentSolutionNumber = 1;
        this.solutionCache[1] = {
          label: this.representativeSolutionLabel,
          facets: this.representativeSolution.map((facet) => ({ ...facet })),
        };
        this.activeOperationLabel = '';
        this.refreshPlanSummary();
        if (replacementRunId && replacementRunId !== response.runId) {
          this.stopDetachedSession(replacementRunId);
        }
        setTimeout(() => this.graph?.fitGraph());
      },
      error: (error) => {
        if (this.destroyed || startGeneration !== this.sessionStartGeneration) {
          return;
        }
        this.sessionStatus = replacementRunId ? 'ready' : 'failed';
        this.backendError = this.errorMessage(error);
        this.activeOperationLabel = '';
      },
    });
  }

  private defaultExplorationHorizon(step: IterationStep): number {
    return Math.min(
      this.maxSessionHorizon,
      Math.max(step.plan?.actions?.length ?? 1, 1),
    );
  }

  private clearSessionState(): void {
    this.runId = undefined;
    this.sessionReused = false;
    this.facets = [];
    this.activePinnedFacets = {};
    this.knownFacets = {};
    this.pendingSelections = {};
    this.representativeSolution = [];
    this.propertyEvaluations = [];
    this.representativeSolutionLabel = '';
    this.currentSolutionNumber = 0;
    this.solutionCache = {};
    this.inspectedFacetId = undefined;
    this.activeFilter = 'all';
    this.query = '';
    this.facetListLimit = this.facetPageSize;
    this.graphFacetLimit = this.initialGraphFacetLimit;
    this.solutionCount = 0;
    this.solutionCountKnown = false;
    this.backendError = undefined;
    this.lastSpaceChangeSummary = '';
    this.activeOperationLabel = '';
    this.queryPending = false;
  }

  private refreshPlanSummary(): void {
    if (!this.runId) {
      return;
    }

    const runId = this.runId;
    this.solutionCountKnown = false;
    this.queryPending = true;
    this.activeOperationLabel = 'Counting remaining plans';
    forkJoin({
      count: this.planPilotService.query$(runId, 'solutionCount').pipe(
        map((response) => ({ response, error: undefined })),
        catchError((error: unknown) => of({ response: undefined, error })),
      ),
      solution: this.planPilotService.query$(runId, 'solution', 1).pipe(
        map((response) => ({ response, error: undefined })),
        catchError((error: unknown) => of({ response: undefined, error })),
      ),
    }).subscribe({
      next: ({ count, solution }) => {
        if (this.runId !== runId) {
          return;
        }
        const errors: string[] = [];
        const returnedCount = count.response?.result.value;
        if (count.error) {
          errors.push(`Plan count unavailable: ${this.errorMessage(count.error)}`);
        } else if (!Number.isInteger(returnedCount) || (returnedCount ?? -1) < 0) {
          errors.push('PlanPilot did not return a valid solution count.');
        } else {
          this.solutionCount = returnedCount!;
          this.solutionCountKnown = true;
          this.facets = this.facets.map((facet) => (
            facet.nodeType === 'root'
              ? { ...facet, remainingSolutions: returnedCount! }
              : facet
          ));
        }

        const representative = this.solutionCountKnown && this.solutionCount === 0
          ? undefined
          : solution.response?.result.solutions?.[0];
        if (solution.error) {
          errors.push(`Plan unavailable: ${this.errorMessage(solution.error)}`);
        } else if (
          this.solutionCountKnown
          && this.solutionCount > 0
          && !representative?.facets.length
        ) {
          errors.push('PlanPilot reported valid plans but did not return the requested plan.');
        }

        this.currentSolutionNumber = representative?.facets.length ? 1 : 0;
        this.representativeSolutionLabel = representative?.label ?? '';
        this.representativeSolution = this.toRepresentativeSolution(representative?.facets ?? []);
        this.evaluateCurrentProperties();
        this.backendError = errors.length ? errors.join(' ') : undefined;
        if (this.currentSolutionNumber === 1 && this.representativeSolution.length) {
          this.solutionCache[1] = {
            label: this.representativeSolutionLabel,
            facets: this.representativeSolution.map((facet) => ({ ...facet })),
          };
        }
        this.queryPending = false;
        this.activeOperationLabel = '';
        setTimeout(() => this.graph?.fitGraph());
      },
      error: (error) => {
        if (this.runId !== runId) {
          return;
        }
        this.backendError = this.errorMessage(error);
        this.solutionCountKnown = false;
        this.queryPending = false;
        this.activeOperationLabel = '';
      },
    });
  }

  private applyBackendFacets(facets: PlanPilotFacet[], summarizeChange = false): void {
    this.representativeSolution = [];
    this.representativeSolutionLabel = '';
    this.solutionCache = {};
    const previousAvailableIds = new Set(
      this.facets
        .filter((facet) => !this.isStructuralFacet(facet) && facet.available)
        .map((facet) => facet.id),
    );
    const mapped = facets
      .map((facet, index) => this.toPlanPilotUiFacet(facet, index))
      .sort((left, right) => left.timestep - right.timestep || left.label.localeCompare(right.label));

    const pinned = Object.values(this.activePinnedFacets)
      .filter((facet) => !mapped.some((candidate) => candidate.id === facet.id))
      .map((facet) => ({
        ...facet,
        available: false,
        parentId: undefined,
      }));

    this.knownFacets = {
      ...this.knownFacets,
      ...Object.fromEntries(mapped.map((facet) => [facet.id, facet])),
      ...Object.fromEntries(pinned.map((facet) => [facet.id, facet])),
    };

    const navigableFacets = [...mapped, ...pinned]
      .sort((left, right) => this.compareGraphOrder(left, right));

    if (summarizeChange && previousAvailableIds.size > 0) {
      const nextAvailableIds = new Set(mapped.map((facet) => facet.id));
      const added = mapped.filter((facet) => !previousAvailableIds.has(facet.id)).length;
      const removed = Array.from(previousAvailableIds).filter((id) => !nextAvailableIds.has(id)).length;
      this.lastSpaceChangeSummary = `${added} facets entered current space · ${removed} left current space`;
    }

    const root: PlanPilotUiFacet = {
      id: '__session__',
      label: 'Current plan space',
      detail: 'Entry point for the current iteration step. It is not a planning action or timestep.',
      timestep: -1,
      action: 'session',
      actionArguments: [],
      group: 'Session',
      selection: 'neutral',
      nodeType: 'root',
      remainingSolutions: this.solutionCountKnown ? this.solutionCount : null,
      remainingFacets: mapped.length,
      solutionReduction: 0,
      facetReduction: 0,
      available: true,
      selectable: false,
      tokens: ['iteration-step', 'plan-space', 'session'],
    };

    const nextFacets = [
      root,
      ...navigableFacets,
    ];
    this.facets = nextFacets;
    if (!navigableFacets.length) {
      this.inspectedFacetId = undefined;
      this.lastSpaceChangeSummary = summarizeChange ? 'Current space is empty for this selection.' : this.lastSpaceChangeSummary;
    } else if (!this.inspectedFacetId || !nextFacets.some((facet) => facet.id === this.inspectedFacetId)) {
      this.inspectedFacetId = navigableFacets[0].id;
    }
  }

  private updatePinnedFacet(facet: PlanPilotUiFacet, selection: FacetSelection): void {
    if (selection === 'neutral') {
      const { [facet.id]: _, ...remaining } = this.activePinnedFacets;
      this.activePinnedFacets = remaining;
      return;
    }

    this.activePinnedFacets = {
      ...this.activePinnedFacets,
      [facet.id]: {
        ...this.withSelectionState(facet, selection),
        available: true,
      },
    };
  }

  private withSelectionState(facet: PlanPilotUiFacet, selection: FacetSelection): PlanPilotUiFacet {
    return withFacetSelectionState(facet, selection);
  }

  private toPlanPilotUiFacet(facet: PlanPilotFacet, index: number): PlanPilotUiFacet {
    return mapBackendFacet(facet, index);
  }

  private isStructuralFacet(facet: PlanPilotUiFacet): boolean {
    return isStructuralPlanPilotFacet(facet);
  }

  private goalFacet(lastAction: PlanPilotUiFacet): PlanPilotUiFacet {
    return {
      id: '__goal__',
      label: 'Goal reached',
      detail: 'The displayed plan satisfies the planning goal.',
      timestep: lastAction.timestep + 1,
      action: 'goal',
      actionArguments: [],
      group: 'Goal',
      selection: 'positive',
      remainingSolutions: this.solutionCountKnown ? this.solutionCount : null,
      remainingFacets: 0,
      solutionReduction: null,
      facetReduction: null,
      available: true,
      parentId: lastAction.id,
      nodeType: 'goal',
      tokens: ['goal', 'reached'],
      solutionContext: true,
    };
  }

  private isUserConstraint(facet: PlanPilotUiFacet): boolean {
    if (this.isStructuralFacet(facet)) {
      return false;
    }
    return facet.selection !== 'neutral' && (
      facet.facetType === 'selected' ||
      Boolean(this.activePinnedFacets[facet.id])
    );
  }

  private compareGraphOrder(left: PlanPilotUiFacet, right: PlanPilotUiFacet): number {
    return this.graphOrderWeight(left) - this.graphOrderWeight(right)
      || left.timestep - right.timestep
      || left.label.localeCompare(right.label);
  }

  private graphOrderWeight(facet: PlanPilotUiFacet): number {
    if (facet.selection === 'positive') {
      return 0;
    }
    if (facet.group === 'In every plan') {
      return 1;
    }
    if (!facet.available) {
      return 4;
    }
    if (facet.selection === 'negative') {
      return 3;
    }
    return 2;
  }

  private refreshFacets(refreshSummaryAfter = false): void {
    if (!this.runId) {
      return;
    }

    this.queryPending = true;
    this.activeOperationLabel = 'Refreshing plan space';
    this.planPilotService.listFacets$(this.runId).subscribe({
      next: (response) => {
        this.backendError = undefined;
        this.applyBackendFacets(response.facets);
        if (refreshSummaryAfter) {
          this.refreshPlanSummary();
        } else {
          this.queryPending = false;
          this.activeOperationLabel = '';
        }
        setTimeout(() => this.graph?.fitGraph());
      },
      error: (error) => {
        this.backendError = this.errorMessage(error);
        this.queryPending = false;
        this.activeOperationLabel = '';
      },
    });
  }

  private toRepresentativeSolution(facets: PlanPilotFacet[]): PlanPilotUiFacet[] {
    return mapRepresentativeSolution(facets, this.solutionCount);
  }

  private decorateGraphFacet(facet: PlanPilotUiFacet): PlanPilotUiFacet {
    const propertyLabels = this.propertyEvaluations
      .filter((property) => property.establishedByFacetId === facet.id)
      .map((property) => property.label);
    const decorated = {
      ...facet,
      propertyLabels,
      userConstraint: this.isRequiredFacet(facet) || this.isForbiddenFacet(facet),
    };
    return { ...decorated, meta: this.graphFacetMeta(decorated) };
  }

  private evaluateCurrentProperties(): void {
    this.propertyEvaluations = evaluatePlanPilotProperties(
      this.sessionStep,
      this.planProperties,
      this.representativeSolution,
    );
  }

  private isBackendFacet(facet: PlanPilotUiFacet): boolean {
    return this.facets.some((candidate) => candidate.id === facet.id);
  }

  private restoreDocumentScroll(): void {
    this.document.body.classList.remove(this.fullscreenBodyClass);
    if (!this.fullscreenScrollLocked) {
      return;
    }
    this.document.body.style.overflow = this.bodyOverflowBeforeFullscreen;
    this.fullscreenScrollLocked = false;
  }

  private stopDetachedSession(runId: string): void {
    this.planPilotService.stopSession$(runId).pipe(take(1)).subscribe({ error: () => undefined });
  }

  private graphFacetMeta(facet: PlanPilotUiFacet): string {
    const pending = this.pendingSelections[facet.id]?.selection;
    if (facet.nodeType === 'root') {
      return this.solutionCountKnown
        ? `${this.solutionCount} valid plan${this.solutionCount === 1 ? '' : 's'}`
        : 'valid plan count pending';
    }
    if (facet.nodeType === 'goal') {
      const satisfied = this.propertyEvaluations.filter((property) => property.status === 'satisfied').length;
      return this.propertyEvaluations.length
        ? `goal reached · ${satisfied}/${this.propertyEvaluations.length} checks`
        : 'goal reached';
    }
    if (facet.facetType === 'empty') {
      return `unused bounded step · t${facet.timestep}`;
    }
    const timestep = facet.abstractTimeStep ? 'any step' : `t${facet.timestep}`;
    if (facet.selection === 'negative') {
      return `${pending === 'negative' ? 'forbid pending' : 'forbidden by you'} · ${timestep}`;
    }
    if (facet.solutionContext && facet.facetType === 'implied') {
      return `in every plan · ${timestep}`;
    }
    if (facet.facetType === 'implied') {
      return `in every plan · ${timestep}`;
    }
    if (facet.solutionContext) {
      const constraintText = pending === 'positive'
        ? ' · require pending'
        : pending === 'negative'
          ? ' · forbid pending'
          : this.isUserConstraint(facet) && facet.selection === 'positive'
            ? ' · required by you'
            : '';
      const propertyText = facet.propertyLabels?.length
        ? ` · ✓ ${facet.propertyLabels.join(', ')}`
        : '';
      return `displayed plan${constraintText} · ${timestep}${propertyText}`;
    }
    if (this.isRequiredFacet(facet)) {
      return `${pending === 'positive' ? 'require pending' : 'required by you'} · ${timestep}`;
    }
    if (!facet.available) {
      return `active constraint · ${timestep}`;
    }
    return `available · ${timestep}`;
  }

  private readableFacetId(facetId: string): string {
    const match = facetId.match(/occurs\(action\(\(\"([^\"]+)\"((?:,\"[^\"]+\")*)\)\),\d+\)/);
    if (!match) {
      return facetId;
    }
    const parameters = match[2]
      .split(',')
      .filter(Boolean)
      .map((value) => value.replace(/\"/g, ''));
    return [match[1], ...parameters].join(' ');
  }

  private graphDiagnosticFilename(generatedAt: string): string {
    const stepName = (this.sessionStep?.name ?? 'step')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'step';
    const timestamp = generatedAt.replace(/[:.]/g, '-');
    return `planpilot-${stepName}-${timestamp}.json`;
  }

  private errorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const body = (error as { error?: { code?: string; message?: string } }).error;
      if (body?.code === 'PLAN_SPACE_TOO_LARGE') {
        const actionCount = this.sessionStep?.plan?.actions?.length ?? 0;
        return actionCount > 0
          ? `PlanPilot did not finish in time. The stored plan has ${actionCount} actions. Try exact horizon ${actionCount}, or a bounded horizon close to ${actionCount}.`
          : 'PlanPilot did not finish in time. Try a smaller horizon or exact mode.';
      }
      if (body?.message) {
        return body.message;
      }
    }
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
    return 'PlanPilot backend request failed.';
  }

  private isSelectionConflict(error: unknown): boolean {
    if (!error || typeof error !== 'object' || !('error' in error)) {
      return false;
    }
    return (error as { error?: { code?: unknown } }).error?.code === 'SELECTION_CONFLICT';
  }

}
