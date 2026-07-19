import { AsyncPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { Store } from "@ngrx/store";
import {
  PlanPilotEncoding,
  PlanPilotFacet,
  PlanPilotSelectionState,
} from "../../domain/planpilot";
import {
  selectPlanPilotFacet,
  startPlanPilotSession,
} from "../../state/planpilot.actions";
import {
  selectDecisions,
  selectError,
  selectFacets,
  selectLoading,
  selectRunId,
  selectSolutionCount,
  selectSolutions,
  selectSolutionsLoading,
} from "../../state/planpilot.feature";

@Component({
  selector: "app-planpilot-facets",
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: "./planpilot-facets.component.html",
  styleUrl: "./planpilot-facets.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPilotFacetsComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  // The iteration step whose plan is SOLVED (provided from outside).
  iterationStepId = input.required<string>();

  // Label filter applied to both facet lists ("" = show all).
  filterControl = this.fb.nonNullable.control("");
  private filterLabel$ = this.filterControl.valueChanges.pipe(startWith(""));

  // Read from the store.
  runId$ = this.store.select(selectRunId);
  facets$ = this.store.select(selectFacets);
  decisions$ = this.store.select(selectDecisions);
  // Distinct facet labels (open + decided), used to populate the filter dropdown.
  filterOptions$ = combineLatest([this.facets$, this.decisions$]).pipe(
    map(([facets, decisions]) => this.distinctLabels([...facets, ...decisions])),
  );
  // Filtered views used by the template.
  filteredFacets$ = combineLatest([this.facets$, this.filterLabel$]).pipe(
    map(([facets, label]) => this.filterByLabel(facets, label)),
  );
  filteredDecisions$ = combineLatest([this.decisions$, this.filterLabel$]).pipe(
    map(([decisions, label]) => this.filterByLabel(decisions, label)),
  );
  solutionCount$ = this.store.select(selectSolutionCount);
  solutions$ = this.store.select(selectSolutions);
  solutionsLoading$ = this.store.select(selectSolutionsLoading);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError).pipe(map((err) => this.toMessage(err)));

  // Expose the enums to the template.
  readonly SelectionState = PlanPilotSelectionState;
  readonly encodings = Object.values(PlanPilotEncoding);

  startForm = this.fb.nonNullable.group({
    horizon: [5, [Validators.required, Validators.min(1)]],
    encoding: [PlanPilotEncoding.EXACT, Validators.required],
    abstractTimeSteps: [false],
  });

  startSession(): void {
    const { horizon, encoding, abstractTimeSteps } = this.startForm.getRawValue();
    this.store.dispatch(
      startPlanPilotSession({
        request: {
          iterationStepId: this.iterationStepId(),
          horizon,
          encoding,
          abstractTimeSteps,
        },
      }),
    );
  }

  onSelectionChange(facet: PlanPilotFacet, next: PlanPilotSelectionState): void {
    this.store.dispatch(
      selectPlanPilotFacet({
        request: {
          facetId: facet.id,
          selectionState: next,
          previousSelectionState: facet.selectionState,
        },
      }),
    );
  }

  // Undo a committed decision: set it back to neutral.
  // Both lists update: the reducer removes it from decisions and the backend
  // returns it as an open facet again.
  deselect(decision: PlanPilotFacet): void {
    this.onSelectionChange(decision, PlanPilotSelectionState.NEUTRAL);
  }

  sortByTimestep(facets: PlanPilotFacet[]): PlanPilotFacet[] {
    return [...facets].sort((a, b) => (a.timestep ?? 0) - (b.timestep ?? 0));
  }

  // Keep only facets with the selected label ("" = no filter).
  private filterByLabel(facets: PlanPilotFacet[], label: string): PlanPilotFacet[] {
    if (!label) {
      return facets;
    }
    return facets.filter((facet) => facet.label === label);
  }

  // Sorted, de-duplicated list of facet labels for the filter dropdown.
  private distinctLabels(facets: PlanPilotFacet[]): string[] {
    return [...new Set(facets.map((facet) => facet.label))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  // The concrete, ordered steps of a plan. PlanPilot solutions also carry
  // timeless "occurs-sometime" landmark entries (timestep === null); those are
  // not actual sequential steps, so we drop them and order by timestep.
  planSteps(facets: PlanPilotFacet[]): PlanPilotFacet[] {
    return facets
      .filter((f) => f.timestep !== null)
      .sort((a, b) => (a.timestep ?? 0) - (b.timestep ?? 0));
  }

  // Turns an arbitrary error into a readable message.
  private toMessage(err: unknown): string | undefined {
    if (err === undefined || err === null) {
      return undefined;
    }
    if (typeof err === "string") {
      return err;
    }
    if (err instanceof HttpErrorResponse) {
      const backend = err.error;
      const detail =
        typeof backend === "string"
          ? backend
          : (backend?.message ?? backend?.error ?? err.message);
      return `HTTP ${err.status} – ${detail}`;
    }
    if (err instanceof Error) {
      return err.message;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
}
