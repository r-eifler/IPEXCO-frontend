import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of, Subject, throwError } from 'rxjs';
import { PlanRunStatus } from '../../domain/plan';
import { PlanPilotFacet, PlanPilotFacetListResponse, PlanPilotService, PlanPilotSessionResponse } from '../../service/planpilot.service';
import { PLANPILOT_GRAPH_CONTRACT } from './planpilot-graph-contract.fixture';
import { PlanPilotViewComponent } from './planpilot-view.component';

describe('PlanPilotViewComponent selection workflow', () => {
  let component: PlanPilotViewComponent;
  let service: jasmine.SpyObj<PlanPilotService>;

  beforeEach(() => {
    service = jasmine.createSpyObj<PlanPilotService>('PlanPilotService', [
      'applyFacets$',
      'listFacets$',
      'query$',
      'startSession$',
      'stopSession$',
    ]);
    service.listFacets$.and.returnValue(of({ runId: 'run-1', facets: [] }));
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? {
        runId: 'run-1',
        result: {
          type: 'solution',
          solutions: [{
            label: 'solution 1',
            facets: [{
              id: 'solution-action',
              label: 'unstack a b',
              timestep: 3,
              selectionState: 'neutral',
            }],
          }],
        },
      }
      : {
        runId: 'run-1',
        result: { type: 'solutionCount', value: 1 },
      }));
    service.stopSession$.and.returnValue(of({ runId: 'run-1', status: 'STOPPED' }));

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: { select: () => of(undefined) } },
        { provide: PlanPilotService, useValue: service },
      ],
    });

    component = TestBed.runInInjectionContext(() => new PlanPilotViewComponent());
    component.runId = 'run-1';
    component.sessionStatus = 'ready';
    component.facets = [facet('include-me'), facet('exclude-me')];
  });

  it('stops an active PlanPilot run when the view is destroyed', () => {
    component.ngOnDestroy();

    expect(service.stopSession$).toHaveBeenCalledOnceWith('run-1');
    expect(component.runId).toBeUndefined();
  });

  it('stops a session that finishes starting after the view was destroyed', () => {
    const startResponse = new Subject<PlanPilotSessionResponse>();
    service.startSession$.and.returnValue(startResponse);
    component.runId = undefined;

    (component as unknown as { startSession: (value: unknown) => void })
      .startSession(solvedStep('late-step'));
    component.ngOnDestroy();
    startResponse.next(sessionResponse('late-run'));

    expect(service.stopSession$).toHaveBeenCalledOnceWith('late-run');
    expect(component.runId).toBeUndefined();
    expect(component.sessionStatus).not.toBe('ready');
  });

  it('ignores and stops a stale session start response', () => {
    const firstStart = new Subject<PlanPilotSessionResponse>();
    const secondStart = new Subject<PlanPilotSessionResponse>();
    service.startSession$.and.returnValues(firstStart, secondStart);
    component.runId = undefined;
    const start = component as unknown as { startSession: (value: unknown) => void };

    start.startSession(solvedStep('first-step'));
    start.startSession(solvedStep('second-step'));
    secondStart.next(sessionResponse('current-run'));
    firstStart.next(sessionResponse('stale-run'));

    expect(component.runId as string | undefined).toBe('current-run');
    expect(component.sessionStatus).toBe('ready');
    expect(service.stopSession$).toHaveBeenCalledWith('stale-run');
    expect(service.stopSession$).not.toHaveBeenCalledWith('current-run');
  });

  it('does not enter the ready state when session creation has no concrete plan', () => {
    service.startSession$.and.returnValue(of({
      runId: 'run-without-plan',
      externalSessionId: 'external-without-plan',
      status: 'READY',
      configuration: { horizon: 12, encoding: 'bounded', abstractTimeSteps: false },
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      hasPlan: false,
      minimumHorizon: null,
      solution: null,
      facets: [],
      reused: false,
    }));
    const step = {
      _id: 'step-1',
      plan: {
        status: PlanRunStatus.SOLVED,
        actions: [{ name: 'move', parameters: [] }],
      },
    } as never;

    (component as unknown as { startSession: (value: unknown) => void })
      .startSession(step);

    expect(component.sessionStatus).toBe('failed');
    expect(component.runId).toBeUndefined();
    expect(component.backendError).toContain('did not return a concrete plan');
    expect(service.stopSession$).toHaveBeenCalledWith('run-without-plan');
  });

  it('starts a large solved step at its known plan length instead of padding the horizon', () => {
    const actions = Array.from({ length: 20 }, (_, index) => ({
      name: `move-${index + 1}`,
      parameters: [],
    }));
    service.startSession$.and.returnValue(of({
      runId: 'large-run',
      externalSessionId: 'large-external-run',
      status: 'READY',
      configuration: { horizon: 20, encoding: 'bounded', abstractTimeSteps: false },
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      hasPlan: true,
      minimumHorizon: 20,
      solution: {
        label: 'solution 1',
        facets: [backendFacet('confirmed-action', 'positive')],
      },
      facets: [backendFacet('confirmed-action', 'positive')],
      reused: false,
    }));
    component.sessionHorizon = 0;

    (component as unknown as { startSession: (value: unknown) => void })
      .startSession({
        _id: 'large-step',
        plan: { status: PlanRunStatus.SOLVED, actions },
      });

    expect(service.startSession$).toHaveBeenCalledWith(jasmine.objectContaining({
      iterationStepId: 'large-step',
      horizon: 20,
      encoding: 'bounded',
    }));
  });

  it('caps the automatic horizon at the API limit', () => {
    const defaultHorizon = component as unknown as {
      defaultExplorationHorizon: (step: unknown) => number;
    };
    const actions = Array.from({ length: 120 }, (_, index) => ({
      name: `move-${index + 1}`,
      parameters: [],
    }));

    expect(defaultHorizon.defaultExplorationHorizon({
      plan: { status: PlanRunStatus.SOLVED, actions },
    })).toBe(100);
  });

  it('uses concise property status wording', () => {
    expect(component.propertyStatusLabel({
      id: 'required', label: 'b on a', description: '', color: '', icon: '',
      kind: 'required', status: 'satisfied', stableSinceTimestep: 6,
    })).toBe('True from t6 onward');
    expect(component.propertyStatusLabel({
      id: 'missing', label: 'c on b', description: '', color: '', icon: '',
      kind: 'required', status: 'unsatisfied', stableSinceTimestep: null,
    })).toBe('Not true after the final action');
  });

  it('turns a plan-space timeout into a configuration hint for the stored plan', () => {
    const privateComponent = component as unknown as {
      sessionStep: unknown;
      errorMessage: (error: unknown) => string;
    };
    privateComponent.sessionStep = {
      plan: {
        status: PlanRunStatus.SOLVED,
        actions: Array.from({ length: 20 }, () => ({ name: 'move', parameters: [] })),
      },
    };

    expect(privateComponent.errorMessage({
      error: {
        code: 'PLAN_SPACE_TOO_LARGE',
        message: 'generic upstream message',
      },
    })).toBe(
      'PlanPilot did not finish in time. The stored plan has 20 actions. '
      + 'Try exact horizon 20, or a bounded horizon close to 20.',
    );
  });

  it('keeps include, exclude, and clear as three separate actions', () => {
    const choice = component.facets[0];
    expect(component.canRequireFacet(choice)).toBeTrue();
    expect(component.canForbidFacet(choice)).toBeTrue();
    expect(component.canClearFacet(choice)).toBeFalse();

    component.applyFacetSelection(choice.id, 'positive');
    expect(component.canRequireFacet(component.facets[0])).toBeFalse();
    expect(component.canForbidFacet(component.facets[0])).toBeTrue();
    expect(component.canClearFacet(component.facets[0])).toBeTrue();

    component.applyFacetSelection(choice.id, 'positive');
    expect(component.facets[0].selection).toBe('positive');
    expect(component.pendingSelectionCount).toBe(1);

    component.applyFacetSelection(choice.id, 'negative');
    expect(component.facets[0].selection).toBe('negative');
    expect(component.pendingSelectionEntries[0]).toEqual(jasmine.objectContaining({
      selection: 'negative',
      previousSelection: 'neutral',
    }));

    component.applyFacetSelection(choice.id, 'neutral');
    expect(component.facets[0].selection).toBe('neutral');
    expect(component.pendingSelectionCount).toBe(0);

    component.applyFacetSelection(choice.id, 'negative');
    expect(component.canRequireFacet(component.facets[0])).toBeTrue();
    expect(component.canForbidFacet(component.facets[0])).toBeFalse();
    expect(component.canClearFacet(component.facets[0])).toBeTrue();
  });

  it('recognizes a positive selected facet as clearable after a backend refresh', () => {
    const applyBackendFacets = component as unknown as {
      applyBackendFacets: (facets: PlanPilotFacet[]) => void;
    };

    applyBackendFacets.applyBackendFacets([{
      ...backendFacet('persisted-include', 'positive'),
      facetType: 'selected',
      selectable: true,
    }]);

    const included = component.facets.find((item) => item.id === 'persisted-include')!;
    expect(component.facetStateLabel(included)).toBe('Required by you');
    expect(component.canClearFacet(included)).toBeTrue();
    expect(component.selectedConstraintCount).toBe(1);
  });

  it('stages include and exclude and commits both only after one confirmed request', () => {
    const response = new Subject<PlanPilotFacetListResponse>();
    service.applyFacets$.and.returnValue(response);

    component.applyFacetSelection('include-me', 'positive');
    component.applyFacetSelection('exclude-me', 'negative');

    expect(component.pendingSelectionCount).toBe(2);
    expect(component.facets.find((item) => item.id === 'include-me')?.selection).toBe('positive');
    expect(component.facets.find((item) => item.id === 'exclude-me')?.selection).toBe('negative');

    component.computeStagedSelections();

    expect(service.applyFacets$).toHaveBeenCalledTimes(1);
    expect(service.applyFacets$).toHaveBeenCalledWith('run-1', {
      selections: [
        { facetId: 'exclude-me', selectionState: 'negative', previousSelectionState: 'neutral' },
        { facetId: 'include-me', selectionState: 'positive', previousSelectionState: 'neutral' },
      ],
    });
    expect(component.selectionPending).toBeTrue();
    expect(component.pendingSelectionCount).toBe(2);

    response.next({
      runId: 'run-1',
      facets: [
        backendFacet('include-me', 'positive'),
        backendFacet('exclude-me', 'negative'),
      ],
    });
    response.complete();

    expect(component.selectionPending).toBeFalse();
    expect(component.pendingSelectionCount).toBe(0);
    expect(component.selectedConstraintCount).toBe(1);
    expect(component.excludedConstraintCount).toBe(1);
  });

  it('keeps staged changes visible and retryable when the batch fails', () => {
    const response = new Subject<PlanPilotFacetListResponse>();
    service.applyFacets$.and.returnValue(response);
    component.applyFacetSelection('include-me', 'positive');
    component.applyFacetSelection('exclude-me', 'negative');

    component.computeStagedSelections();
    response.error(new Error('batch failed'));

    expect(component.selectionPending).toBeFalse();
    expect(component.pendingSelectionCount).toBe(2);
    expect(component.facets.find((item) => item.id === 'include-me')?.selection).toBe('positive');
    expect(component.facets.find((item) => item.id === 'exclude-me')?.selection).toBe('negative');
    expect(component.lastSelectionMessage).toContain('not applied');
  });

  it('drops stale staged changes and reloads facets after a selection conflict', () => {
    const applyResponse = new Subject<PlanPilotFacetListResponse>();
    const refreshedFacets = new Subject<PlanPilotFacetListResponse>();
    service.applyFacets$.and.returnValue(applyResponse);
    service.listFacets$.and.returnValue(refreshedFacets);
    component.applyFacetSelection('include-me', 'positive');

    component.computeStagedSelections();
    applyResponse.error({
      status: 409,
      error: {
        code: 'SELECTION_CONFLICT',
        message: 'The facet selection changed in another request.',
      },
    });

    expect(component.pendingSelectionCount).toBe(0);
    expect(component.selectionPending).toBeFalse();
    expect(component.facets.find((facet) => facet.id === 'include-me')?.selection).toBe('neutral');
    expect(service.listFacets$).toHaveBeenCalledOnceWith('run-1');
    expect(component.lastSelectionMessage).toContain('select your changes again');

    refreshedFacets.next({
      runId: 'run-1',
      facets: [backendFacet('include-me', 'negative')],
    });
    refreshedFacets.complete();

    expect(component.facets.find((facet) => facet.id === 'include-me')?.selection).toBe('negative');
  });

  it('replaces a staged positive with another positive at the same timestep', () => {
    component.applyFacetSelection('include-me', 'positive');
    component.applyFacetSelection('exclude-me', 'positive');

    expect(component.pendingSelectionCount).toBe(1);
    expect(component.facets.find((item) => item.id === 'include-me')?.selection).toBe('neutral');
    expect(component.facets.find((item) => item.id === 'exclude-me')?.selection).toBe('positive');
  });

  it('does not treat abstract any-time facets as competing concrete timesteps', () => {
    component.facets = [
      { ...facet('abstract-a'), timestep: 0, abstractTimeStep: true },
      { ...facet('abstract-b'), timestep: 0, abstractTimeStep: true },
    ];

    component.applyFacetSelection('abstract-a', 'positive');
    component.applyFacetSelection('abstract-b', 'positive');

    expect(component.pendingSelectionCount).toBe(2);
    expect(component.facets.every((item) => item.selection === 'positive')).toBeTrue();
  });

  it('keeps an applied facet as context when it leaves the current backend space', () => {
    service.applyFacets$.and.returnValue(of({
      runId: 'run-1',
      facets: [backendFacet('exclude-me', 'negative')],
    }));

    component.applyFacetSelection('include-me', 'positive');
    component.computeStagedSelections();

    const included = component.facets.find((item) => item.id === 'include-me');
    expect(included?.selection).toBe('positive');
    expect(included?.available).toBeFalse();
    expect(component.graphFacets.map((item) => item.id)).toContain('include-me');
    expect(component.graphConnections).not.toContain(jasmine.objectContaining({
      targetId: 'include-me',
    }));
  });

  it('always keeps the session root and does not let inspector filters mutate graph topology', () => {
    component.facets = [
      rootFacet(),
      facet('open-facet'),
      { ...facet('selected-facet'), selection: 'positive', group: 'Selected plan', nodeType: 'path' },
    ];
    component.setFilter('selected');
    component.query = 'selected';

    expect(component.visibleFacets.map((item) => item.id)).toEqual(['selected-facet']);
    expect(component.graphFacets.map((item) => item.id)).toEqual([
      '__session__',
      'open-facet',
      'selected-facet',
    ]);
  });

  it('caps a dense plan space by default while keeping every facet searchable and explicitly expandable', () => {
    component.facets = [
      rootFacet(),
      ...Array.from({ length: 100 }, (_, index) => ({
        ...facet(`choice-${index + 1}`),
        label: `Choice ${index + 1}`,
      })),
    ];
    component.inspectedFacetId = undefined;

    expect(component.matchingFacets.length).toBe(100);
    expect(component.visibleFacets.length).toBe(40);
    expect(component.graphFacets.length).toBe(50);
    expect(component.hiddenGraphFacetCount).toBe(51);

    component.query = 'Choice 99';
    component.selectFacet('choice-99');

    expect(component.visibleFacets.map((item) => item.id)).toEqual(['choice-99']);
    expect(component.graphFacets.map((item) => item.id)).toContain('choice-99');

    component.query = '';
    component.showMoreFacets();
    component.showMoreGraphFacets();

    expect(component.visibleFacets.length).toBe(80);
    expect(component.graphFacets.length).toBe(100);
    component.showAllFacets();
    component.showAllGraphFacets();
    expect(component.visibleFacets.length).toBe(100);
    expect(component.graphFacets.length).toBe(101);
    expect(component.hiddenGraphFacetCount).toBe(0);

    component.collapseFacetList();
    component.collapseGraphFacets();
    expect(component.visibleFacets.length).toBe(40);
    expect(component.graphFacets.length).toBe(50);
  });

  it('renders every facet when the complete plan space fits below the graph limit', () => {
    component.facets = [
      rootFacet(),
      ...Array.from({ length: 23 }, (_, index) => ({
        ...facet(`choice-${index + 1}`),
        timestep: (index % 4) + 1,
      })),
    ];

    expect(component.graphFacets.length).toBe(24);
    expect(component.hiddenGraphFacetCount).toBe(0);
    expect(component.graphFacets.map((item) => item.id)).toContain('choice-23');
  });

  it('caps large multi-timestep graphs while keeping the full facet list', () => {
    component.facets = [
      rootFacet(),
      ...Array.from({ length: 935 }, (_, index) => ({
        ...facet(`large-choice-${index + 1}`),
        timestep: (index % 24) + 1,
      })),
    ];
    component.inspectedFacetId = undefined;

    expect(component.matchingFacets.length).toBe(935);
    expect(component.graphFacets.length).toBeLessThanOrEqual(50);
    expect(component.hiddenGraphFacetCount).toBeGreaterThan(880);
    expect(new Set(
      component.graphFacets
        .filter((item) => item.id !== '__session__')
        .map((item) => item.timestep),
    ).size).toBe(24);

    component.selectFacet('large-choice-935');

    expect(component.graphFacets.length).toBeLessThanOrEqual(50);
    expect(component.graphFacets.map((item) => item.id)).toContain('large-choice-935');
  });

  it('does not render hundreds of positive dependency facets as active plan nodes', () => {
    const backendFacets = [
      ...Array.from({ length: 20 }, (_, index) => ({
        ...backendFacet(`plan-${index + 1}`, 'positive'),
        timestep: index + 1,
        facetType: 'plan' as const,
      })),
      ...Array.from({ length: 867 }, (_, index) => ({
        ...backendFacet(`dependency-${index + 1}`, 'positive'),
        timestep: (index % 24) + 1,
        facetType: 'implied' as const,
      })),
    ];

    (component as unknown as { applyBackendFacets: (facets: typeof backendFacets) => void })
      .applyBackendFacets(backendFacets);

    const dependencies = component.facets.filter((item) => item.facetType === 'implied');
    expect(dependencies.length).toBe(867);
    expect(dependencies.every((item) => item.selection === 'neutral')).toBeTrue();
    expect(component.graphFacets.length).toBeLessThanOrEqual(200);
    expect(component.selectedConstraintCount).toBe(0);
    expect(component.remainingFacetCount).toBe(0);
  });

  it('does not invent a replacement edge when the backend parent is hidden', () => {
    component.facets = [
      rootFacet(),
      { ...facet('plan-1'), timestep: 1, selection: 'positive', facetType: 'plan', nodeType: 'plan' },
      { ...facet('alternative-3'), timestep: 3, parentId: 'hidden-2' },
    ];
    component.representativeSolution = [{
      ...facet('plan-1'),
      timestep: 1,
      selection: 'positive',
      facetType: 'plan',
      nodeType: 'plan',
      solutionContext: true,
    }];

    expect(component.graphConnections).not.toContain(jasmine.objectContaining({
      targetId: 'alternative-3',
    }));
  });

  it('explains the boundary between replan alternatives and the forced suffix', () => {
    component.solutionCount = 1;
    component.sessionHorizon = 12;
    component.facets = [
      rootFacet(),
      { ...facet('alternative-7'), timestep: 7 },
    ];
    component.representativeSolution = [
      { ...facet('forced-8'), timestep: 8, solutionContext: true },
    ];

    expect(component.forcedSuffixMessage).toBe(
      '1 plan left. No alternatives after t7.',
    );
  });

  it('distinguishes a neutral displayed action from a user constraint', () => {
    component.facets = [{ ...facet('plan-1'), facetType: 'plan', selection: 'neutral' }];
    component.representativeSolution = [{
      ...facet('plan-1'),
      facetType: 'plan',
      selection: 'neutral',
      parentId: 'plan-root',
      solutionContext: true,
    }];
    component.inspectedFacetId = 'plan-1';

    expect(component.inspectedFacet?.solutionContext).toBeTrue();
    expect(component.inspectedFacet?.parentId).toBe('plan-root');
    expect(component.inspectedFacet && component.facetStateLabel(component.inspectedFacet))
      .toBe('Displayed plan · No constraint');
    expect(component.facetStateLabel(component.facets[0]))
      .toBe('Displayed plan · No constraint');
    expect(component.inspectedFacet && component.canClearFacet(component.inspectedFacet)).toBeFalse();
    expect(component.isDisplayedPlanFacet(component.facets[0])).toBeTrue();
    expect(component.isRequiredFacet(component.facets[0])).toBeFalse();
  });

  it('shows pending constraints on a displayed action before Apply', () => {
    component.facets = [{ ...facet('plan-1'), facetType: 'plan', selection: 'neutral' }];
    component.representativeSolution = [{
      ...facet('plan-1'),
      facetType: 'plan',
      selection: 'neutral',
      solutionContext: true,
    }];

    component.applyFacetSelection('plan-1', 'positive');
    expect(component.facetStateLabel(component.facets[0]))
      .toBe('Displayed plan · Require pending');
    expect(component.isRequiredFacet(component.facets[0])).toBeTrue();
    expect(component.isForbiddenFacet(component.facets[0])).toBeFalse();
    expect(component.graphFacets.find((item) => item.id === 'plan-1')?.userConstraint).toBeTrue();
    expect(component.graphFacets.find((item) => item.id === 'plan-1')?.meta)
      .toContain('require pending');

    component.applyFacetSelection('plan-1', 'negative');
    expect(component.facetStateLabel(component.facets[0]))
      .toBe('Displayed plan · Forbid pending');
    expect(component.isRequiredFacet(component.facets[0])).toBeFalse();
    expect(component.isForbiddenFacet(component.facets[0])).toBeTrue();
    expect(component.graphFacets.find((item) => item.id === 'plan-1')?.meta)
      .toContain('forbid pending');
  });

  it('does not count displayed-plan facets as alternatives', () => {
    component.facets = [facet('plan-1'), facet('alternative-1')];
    component.representativeSolution = [{
      ...facet('plan-1'),
      solutionContext: true,
    }];

    expect(component.matchingFacets.length).toBe(2);
    expect(component.remainingFacetCount).toBe(1);
  });

  it('renders an empty confirmed space with its root instead of an empty canvas', () => {
    service.applyFacets$.and.returnValue(of({ runId: 'run-1', facets: [] }));
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? { runId: 'run-1', result: { type: 'solution', solutions: [] } }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 0 } }));
    component.applyFacetSelection('include-me', 'positive');

    component.computeStagedSelections();

    expect(component.graphFacets.map((item) => item.id)).toEqual(['__session__', 'include-me']);
    expect(component.facets.find((item) => item.id === 'include-me')?.available).toBeFalse();
  });

  it('does not present implied positive facets as user selections', () => {
    service.applyFacets$.and.returnValue(of({
      runId: 'run-1',
      facets: [{
        ...backendFacet('implied-by-choice', 'positive'),
        facetType: 'implied',
        impliedBy: ['include-me'],
      }],
    }));
    component.applyFacetSelection('include-me', 'positive');

    component.computeStagedSelections();

    const implied = component.facets.find((item) => item.id === 'implied-by-choice');
    expect(implied?.group).toBe('In every plan');
    expect(implied?.nodeType).toBeUndefined();
    expect(implied?.selection).toBe('neutral');
    expect(implied && component.facetStateLabel(implied)).toBe('Occurs in every plan');
    expect(implied && component.canRequireFacet(implied)).toBeFalse();
    expect(implied && component.canClearFacet(implied)).toBeFalse();
    expect(implied?.detail).toContain('every remaining plan');
    expect(implied?.detail).not.toContain('unknown plans');
    expect(component.selectedConstraintCount).toBe(1);
  });

  it('allows an any-step choice to be staged and cleared before applying', () => {
    component.facets = [
      rootFacet(),
      {
        ...facet('any-step-action'),
        timestep: 0,
        abstractTimeStep: true,
      },
    ];

    component.applyFacetSelection('any-step-action', 'positive');

    expect(component.pendingSelectionEntries).toEqual([jasmine.objectContaining({
      facetId: 'any-step-action',
      selection: 'positive',
      previousSelection: 'neutral',
    })]);
    expect(component.canClearFacet(component.facets[1])).toBeTrue();
    expect(component.timestepLabel(component.facets[1])).toBe('Any step');
    expect(component.graphFacets.find((item) => item.id === 'any-step-action')?.meta)
      .toContain('any step');
    expect(component.graphFacets.find((item) => item.id === 'any-step-action')?.meta)
      .not.toContain('t0');
  });

  it('adds the confirmed representative solution to the graph after applying', () => {
    service.applyFacets$.and.returnValue(of({
      runId: 'run-1',
      facets: [backendFacet('include-me', 'positive')],
    }));
    component.applyFacetSelection('include-me', 'positive');

    component.computeStagedSelections();

    expect(component.representativeSolutionLabel).toBe('solution 1');
    expect(component.representativeSolution.map((item) => item.label))
      .toEqual(['unstack a b']);
    expect(component.graphFacets.map((item) => item.id)).toContain('solution-action');
    expect(component.graphFacets.map((item) => item.id)).toContain('__goal__');
    expect(component.graphConnections).toContain(jasmine.objectContaining({
      sourceId: 'solution-action',
      targetId: '__goal__',
      kind: 'plan',
    }));
  });

  it('loads another concrete plan without changing the active constraints', () => {
    component.solutionCount = 3;
    component.currentSolutionNumber = 1;
    component.solutionCache[1] = {
      label: 'Initial planner plan',
      facets: [{ ...facet('original-plan-action'), solutionContext: true }],
    };
    service.query$.and.returnValue(of({
      runId: 'run-1',
      result: {
        type: 'solution',
        solutions: [{
          label: 'solution 2',
          facets: [{
            id: 'second-plan-action',
            label: 'pick-up c',
            timestep: 4,
            selectionState: 'neutral',
          }],
        }],
      },
    }));

    component.showSolution(2);

    expect(service.query$).toHaveBeenCalledWith('run-1', 'solution', 2);
    expect(component.currentSolutionNumber).toBe(2);
    expect(component.representativeSolutionLabel).toBe('solution 2');
    expect(component.representativeSolution.map((item) => item.label))
      .toEqual(['pick-up c']);
    expect(component.facets.map((item) => item.id)).toEqual(['include-me', 'exclude-me']);

    component.showSolution(1);

    expect(service.query$).toHaveBeenCalledTimes(1);
    expect(component.representativeSolutionLabel).toBe('Initial planner plan');
    expect(component.representativeSolution.map((item) => item.id)).toEqual(['original-plan-action']);
  });

  it('uses the concrete PlanPilot solution for bounded sessions', () => {
    component.facets = [
      rootFacet(),
      { ...facet('planner-1'), timestep: 1, selection: 'positive', facetType: 'plan', nodeType: 'plan' },
      { ...facet('planner-8'), timestep: 8, selection: 'positive', facetType: 'plan', nodeType: 'plan' },
    ];
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? {
        runId: 'run-1',
        result: {
          type: 'solution',
          solutions: [{
            label: 'solution 1',
            facets: [
              backendFacet('planner-1', 'positive'),
              { ...backendFacet('detour-10', 'positive'), timestep: 10 },
            ],
          }],
        },
      }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 9 } }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.representativeSolutionLabel).toBe('solution 1');
    expect(component.representativeSolution.map((item) => item.id)).toEqual([
      'planner-1',
      'detour-10',
    ]);
    expect(component.representativeActionCount).toBe(2);
    expect(component.graphFacets.find((item) => item.id === '__goal__')?.timestep).toBe(11);
  });

  it('does not hide a returned bounded solution when the initial planner path is empty', () => {
    component.sessionEncoding = 'bounded';
    component.facets = [rootFacet(), facet('optional-detour')];
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? {
        runId: 'run-1',
        result: {
          type: 'solution',
          solutions: [{ label: 'solution 1', facets: [backendFacet('enumerated-detour', 'positive')] }],
        },
      }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 3233 } }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.representativeSolutionLabel).toBe('solution 1');
    expect(component.representativeSolution.map((item) => item.id)).toEqual(['enumerated-detour']);
  });

  it('preserves backend topology for bounded solutions without inventing idle actions or parents', () => {
    component.sessionEncoding = 'bounded';
    const toSolution = component as unknown as {
      toRepresentativeSolution: (facets: ReturnType<typeof backendFacet>[]) => typeof component.representativeSolution;
    };

    const result = toSolution.toRepresentativeSolution([
      { ...backendFacet('action-1', 'positive'), timestep: 1 },
      { ...backendFacet('action-3', 'positive'), timestep: 3 },
    ]);

    expect(result.map((item) => item.id)).toEqual(['action-1', 'action-3']);
    expect(result[0].parentId).toBeUndefined();
    expect(result[1].parentId).toBeUndefined();
    component.facets = [rootFacet()];
    component.representativeSolution = result;
    expect(component.totalGraphDomainFacetCount).toBe(2);
    expect(component.hiddenGraphFacetCount).toBe(0);
    expect(component.graphConnections.filter((edge) => edge.sourceId === '__session__')).toEqual([
      { sourceId: '__session__', targetId: 'action-1', kind: 'plan' },
    ]);
    expect(component.buildGraphDiagnostic().integrity.issues)
      .toContain('Representative solution facet has no incoming connection: action-3');
  });

  it('matches the fixed backend graph contract and arrow directions', () => {
    const bridge = component as unknown as {
      applyBackendFacets: (facets: PlanPilotFacet[]) => void;
      toRepresentativeSolution: (facets: PlanPilotFacet[]) => typeof component.representativeSolution;
    };

    bridge.applyBackendFacets(PLANPILOT_GRAPH_CONTRACT.facets);
    component.representativeSolution = bridge.toRepresentativeSolution(PLANPILOT_GRAPH_CONTRACT.solution);

    expect(component.graphConnections).toEqual(PLANPILOT_GRAPH_CONTRACT.expectedConnections);
    expect(component.graphFacets.map((facet) => facet.id)).toContain('__session__');
    expect(component.graphFacets.map((facet) => facet.id)).toContain('__goal__');
    expect(component.graphConnections).not.toContain(jasmine.objectContaining({
      sourceId: 'stack-a-b-t3',
      targetId: 'pick-a-t1',
    }));
    const diagnostic = component.buildGraphDiagnostic();
    expect(diagnostic.integrity.issues).toEqual([]);
    expect(diagnostic.connections).toContain(jasmine.objectContaining({
      sourceId: 'stack-a-b-t3',
      targetId: 'move-c-t5',
      gapTimesteps: [4],
      label: 't4 empty',
    }));
    expect(Array.isArray(diagnostic.applicationAssets)).toBeTrue();
    expect(diagnostic.session['currentSolutionNumber']).toBe(0);
  });

  it('does not silently repair a wrong parent returned by the backend', () => {
    const toSolution = component as unknown as {
      toRepresentativeSolution: (facets: PlanPilotFacet[]) => typeof component.representativeSolution;
    };
    component.facets = [rootFacet()];
    component.representativeSolution = toSolution.toRepresentativeSolution([
      {
        id: 'action-1', label: 'action 1', timestep: 1,
        selectionState: 'positive', facetType: 'plan', parentId: 'action-2',
      },
      {
        id: 'action-2', label: 'action 2', timestep: 2,
        selectionState: 'positive', facetType: 'plan',
      },
    ]);

    expect(component.representativeSolution[0].parentId).toBe('action-2');
    expect(component.graphConnections).not.toContain(jasmine.objectContaining({
      sourceId: 'action-1',
      targetId: 'action-2',
    }));
    expect(component.buildGraphDiagnostic().integrity.issues)
      .toContain('Facet parent is not earlier: action-2 -> action-1');
  });

  it('marks where a selected goal-fact property becomes stable in the displayed plan', () => {
    component.sessionStep = {
      _id: 'step',
      name: 'Property step',
      project: 'project',
      user: 'user',
      status: 'SOLVABLE',
      hardGoals: ['property-1'],
      softGoals: [],
      predecessorStep: null,
      createdAt: new Date(),
      task: {
        name: 'blocks',
        objects: [],
        model: {
          initial: [{ name: 'on', arguments: ['b', 'a'], negated: false }],
          actions: [
            {
              name: 'unstack',
              parameters: [{ name: '?x', type: 'block' }, { name: '?y', type: 'block' }],
              precondition: [],
              effect: [{ name: 'on', arguments: ['?x', '?y'], negated: true }],
            },
            {
              name: 'stack',
              parameters: [{ name: '?x', type: 'block' }, { name: '?y', type: 'block' }],
              precondition: [],
              effect: [{ name: 'on', arguments: ['?x', '?y'], negated: false }],
            },
          ],
        },
      },
    } as never;
    component.planProperties = {
      'property-1': {
        _id: 'property-1',
        project: 'project',
        name: 'b on a',
        definition: { name: 'on', parameters: ['b', 'a'] },
        type: 'G',
        formula: null,
        naturalLanguageDescription: 'Block b is on block a.',
        isUsed: true,
        globalHardGoal: false,
        utility: 1,
        color: '#7e22ce',
        icon: 'verified',
        class: 'goal',
      },
    } as never;
    component.representativeSolution = [
      {
        ...facet('unstack-b-a'),
        label: 'unstack b a',
        action: 'unstack',
        actionArguments: ['b', 'a'],
        timestep: 1,
        selection: 'positive',
        nodeType: 'plan',
        solutionContext: true,
      },
      {
        ...facet('stack-b-a'),
        label: 'stack b a',
        action: 'stack',
        actionArguments: ['b', 'a'],
        timestep: 4,
        selection: 'positive',
        nodeType: 'plan',
        solutionContext: true,
      },
    ];

    (component as unknown as { evaluateCurrentProperties: () => void }).evaluateCurrentProperties();

    expect(component.propertyEvaluations).toEqual([jasmine.objectContaining({
      id: 'property-1',
      status: 'satisfied',
      stableSinceTimestep: 4,
      establishedByFacetId: 'stack-b-a',
    })]);
    expect(component.graphFacets.find((item) => item.id === 'stack-b-a')?.propertyLabels)
      .toEqual(['b on a']);
  });

  it('does not claim an unconfirmed path when the PlanPilot query fails', () => {
    component.sessionEncoding = 'bounded';
    component.facets = [
      rootFacet(),
      { ...facet('planner-1'), timestep: 1, selection: 'positive', facetType: 'plan', nodeType: 'plan' },
    ];
    service.query$.and.returnValue(throwError(() => new Error('FASB count timed out')));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.representativeSolutionLabel).toBe('');
    expect(component.representativeSolution).toEqual([]);
    expect(component.solutionCountKnown).toBeFalse();
    expect(component.backendError).toContain('FASB count timed out');
  });

  it('keeps a confirmed PlanPilot solution visible when only counting times out', () => {
    service.query$.and.callFake((_runId, type) => type === 'solutionCount'
      ? throwError(() => new Error('FASB count timed out'))
      : of({
        runId: 'run-1',
        result: {
          type: 'solution',
          solutions: [{
            label: 'solution 1',
            facets: [backendFacet('confirmed-action', 'positive')],
          }],
        },
      }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.solutionCountKnown).toBeFalse();
    expect(component.representativeSolution.map((item) => item.id)).toEqual(['confirmed-action']);
    expect(component.graphFacets.map((item) => item.id)).toContain('__goal__');
    expect(component.backendError).toContain('Plan count unavailable');
  });

  it('keeps the graph without a green path when no solution exists', () => {
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? { runId: 'run-1', result: { type: 'solution', solutions: [] } }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 0 } }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.solutionCountKnown).toBeTrue();
    expect(component.solutionCount).toBe(0);
    expect(component.currentSolutionNumber).toBe(0);
    expect(component.representativeSolution).toEqual([]);
    expect(component.graphFacets.some((item) => item.solutionContext)).toBeFalse();
    expect(component.graphFacets.some((item) => item.nodeType === 'goal')).toBeFalse();
  });

  it('marks the complete returned solution path, including the root edge, as plan edges', () => {
    component.facets = [
      rootFacet(),
      { ...facet('solution-1'), timestep: 1 },
      { ...facet('solution-2'), timestep: 2 },
    ];
    component.solutionCount = 1;
    component.solutionCountKnown = true;
    component.representativeSolution = [
      { ...facet('solution-1'), timestep: 1, selection: 'positive', solutionContext: true },
      { ...facet('solution-2'), timestep: 2, selection: 'positive', solutionContext: true, parentId: 'solution-1' },
    ];

    expect(component.graphConnections).toContain({
      sourceId: '__session__',
      targetId: 'solution-1',
      kind: 'plan',
    });
    expect(component.graphConnections).toContain({
      sourceId: 'solution-1',
      targetId: 'solution-2',
      kind: 'plan',
    });
  });

  it('rejects a positive solution count without a concrete returned plan', () => {
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? { runId: 'run-1', result: { type: 'solution', solutions: [] } }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 2 } }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.solutionCountKnown).toBeTrue();
    expect(component.representativeSolution).toEqual([]);
    expect(component.backendError).toContain('did not return the requested plan');
  });

  it('uses the exact PlanPilot solution instead of the shorter planner path', () => {
    component.sessionEncoding = 'exact';
    component.sessionHorizon = 10;
    component.facets = [
      rootFacet(),
      ...Array.from({ length: 8 }, (_, index) => ({
        ...facet(`planner-${index + 1}`),
        timestep: index + 1,
        selection: 'positive' as const,
        facetType: 'plan' as const,
        nodeType: 'plan' as const,
      })),
    ];
    const exactFacets = Array.from({ length: 10 }, (_, index) => ({
      ...backendFacet(`exact-${index + 1}`, 'positive'),
      timestep: index + 1,
    }));
    service.query$.and.callFake((_runId, type) => of(type === 'solution'
      ? {
        runId: 'run-1',
        result: { type: 'solution', solutions: [{ label: 'solution 1', facets: exactFacets }] },
      }
      : { runId: 'run-1', result: { type: 'solutionCount', value: 2 } }));

    (component as unknown as { refreshPlanSummary: () => void }).refreshPlanSummary();

    expect(component.representativeSolutionLabel).toBe('solution 1');
    expect(component.representativeSolution.length).toBe(10);
    expect(component.graphFacets.find((item) => item.id === '__goal__')?.timestep).toBe(11);
  });

  it('locks document scrolling only while fullscreen is active', () => {
    document.body.style.overflow = 'auto';

    component.toggleCanvasExpanded();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.classList).toContain('planpilot-fullscreen-open');

    component.exitFullscreenWithEscape();
    expect(component.canvasExpanded).toBeFalse();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.classList).not.toContain('planpilot-fullscreen-open');
  });

  it('accepts exact and bounded encodings and keeps the horizon in the supported range', () => {
    component.updateSessionEncoding({ target: { value: 'exact' } } as unknown as Event);
    component.updateSessionHorizon({ target: { value: '250' } } as unknown as Event);

    expect(component.sessionEncoding).toBe('exact');
    expect(component.sessionHorizon).toBe(100);

    component.updateSessionEncoding({ target: { value: 'bounded' } } as unknown as Event);
    component.updateSessionHorizon({ target: { value: '0' } } as unknown as Event);

    expect(component.sessionEncoding).toBe('bounded');
    expect(component.sessionHorizon).toBe(1);
  });

  it('keeps draft settings separate from the active graph settings', () => {
    component.sessionStatus = 'ready';
    component.activeSessionEncoding = 'bounded';
    component.activeSessionHorizon = 10;
    component.sessionEncoding = 'exact';
    component.sessionHorizon = 30;

    expect(component.displayedSessionEncoding).toBe('bounded');
    expect(component.displayedSessionHorizon).toBe(10);
  });

  it('keeps the working session when replacement settings fail', () => {
    component.activeSessionEncoding = 'bounded';
    component.activeSessionHorizon = 10;
    component.sessionEncoding = 'exact';
    component.sessionHorizon = 30;
    component.sessionStep = solvedStep('step-1') as never;
    component.representativeSolution = [{ ...facet('working'), solutionContext: true }];
    service.startSession$.and.returnValue(throwError(() => ({
      error: { code: 'PLAN_SPACE_TOO_LARGE', message: 'slow' },
    })));

    component.applySessionConfiguration();

    expect(component.runId).toBe('run-1');
    expect(component.sessionStatus).toBe('ready');
    expect(component.displayedSessionEncoding).toBe('bounded');
    expect(component.displayedSessionHorizon).toBe(10);
    expect(component.representativeSolution[0].id).toBe('working');
    expect(service.stopSession$).not.toHaveBeenCalledWith('run-1');
  });

  it('builds a self-contained diagnostic without dropping backend facets', () => {
    component.facets = [
      rootFacet(),
      { ...facet('path-1'), selection: 'positive', nodeType: 'path', group: 'Selected plan' },
      { ...facet('branch-2'), timestep: 2, parentId: 'path-1' },
    ];
    component.graph = {
      exportSnapshot: () => ({
        viewport: { width: 800, height: 600, zoom: 1, pan: { x: 0, y: 0 } },
        imagePngDataUrl: 'data:image/png;base64,test',
        nodes: [],
        edges: [],
      }),
    } as unknown as typeof component.graph;

    const diagnostic = component.buildGraphDiagnostic();

    expect(diagnostic.schemaVersion).toBe('ipexco-planpilot-graph-diagnostic-v3');
    expect(diagnostic.integrity.backendFacetCount).toBe(2);
    expect(diagnostic.integrity.graphFacetCount).toBe(2);
    expect(diagnostic.integrity.issues).toEqual([]);
    expect(diagnostic.integrity.omittedFacetIds).toEqual([]);
    expect(diagnostic.facets.map((item) => item.id)).toEqual(['path-1', 'branch-2']);
    expect(diagnostic.connections).toEqual([]);
    expect(diagnostic.ui['connectionModel']).toBe('representative-solution-only');
    expect(diagnostic.renderedGraph?.imagePngDataUrl).toContain('data:image/png');
  });

  it('reports a same-timestep parent and the resulting orphan solution facet', () => {
    component.facets = [
      rootFacet(),
      { ...facet('solution-a'), timestep: 2 },
      { ...facet('solution-b'), timestep: 2 },
    ];
    component.representativeSolution = [
      { ...facet('solution-a'), timestep: 2, selection: 'positive', solutionContext: true },
      { ...facet('solution-b'), timestep: 2, selection: 'positive', solutionContext: true, parentId: 'solution-a' },
    ];

    const diagnostic = component.buildGraphDiagnostic();

    expect(diagnostic.integrity.issues)
      .toContain('Facet parent is not earlier: solution-a -> solution-b');
    expect(diagnostic.integrity.issues)
      .toContain('Representative solution facet has no incoming connection: solution-b');
  });

  it('reports a missing parent and a missing root connection', () => {
    component.facets = [rootFacet()];
    component.representativeSolution = [{
      ...facet('orphan'),
      timestep: 2,
      selection: 'positive',
      solutionContext: true,
      parentId: 'missing-parent',
    }];

    const diagnostic = component.buildGraphDiagnostic();

    expect(diagnostic.integrity.issues)
      .toContain('Facet parent is missing from graph: orphan -> missing-parent');
    expect(diagnostic.integrity.issues)
      .toContain('Representative solution facet has no incoming connection: orphan');
  });

  it('refreshes the representative solution only after reset facets arrive', () => {
    const listedFacets = new Subject<PlanPilotFacetListResponse>();
    service.listFacets$.and.returnValue(listedFacets);
    service.query$.calls.reset();

    component.resetSessionView();

    expect(service.query$).not.toHaveBeenCalled();
    listedFacets.next({ runId: 'run-1', facets: [backendFacet('restored', 'positive')] });
    listedFacets.complete();

    expect(service.query$).toHaveBeenCalledTimes(2);
    expect(component.representativeSolutionLabel).toBe('solution 1');
  });
});

function facet(id: string) {
  return {
    id,
    label: id,
    detail: `${id} detail`,
    timestep: 1,
    action: id,
    group: 'Available',
    selection: 'neutral' as const,
    remainingSolutions: null,
    remainingFacets: null,
    solutionReduction: null,
    facetReduction: null,
    available: true,
    facetType: 'optional' as const,
    nodeType: 'candidate' as const,
    tokens: [id],
  };
}

function backendFacet(id: string, selectionState: 'positive' | 'negative') {
  return {
    id,
    label: id,
    timestep: 1,
    selectionState,
    facetType: 'optional' as const,
  };
}

function solvedStep(id: string) {
  return {
    _id: id,
    plan: {
      status: PlanRunStatus.SOLVED,
      actions: [{ name: 'move', parameters: [] }],
    },
  };
}

function sessionResponse(runId: string): PlanPilotSessionResponse {
  return {
    runId,
    status: 'READY',
    configuration: { horizon: 1, encoding: 'bounded', abstractTimeSteps: false },
    hasPlan: true,
    minimumHorizon: 1,
    solution: {
      label: 'solution 1',
      facets: [{
        id: 'move-1',
        label: 'move',
        timestep: 1,
        selectionState: 'neutral',
      }],
    },
    facets: [],
  };
}

function rootFacet() {
  return {
    ...facet('__session__'),
    label: 'Current iteration step',
    nodeType: 'root' as const,
    facetType: undefined,
  };
}
