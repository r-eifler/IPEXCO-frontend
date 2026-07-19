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

  // Free-text filter applied to both facet lists (matches on the label).
  searchControl = this.fb.nonNullable.control("");
  private searchTerm$ = this.searchControl.valueChanges.pipe(startWith(""));

  // Read from the store.
  runId$ = this.store.select(selectRunId);
  facets$ = this.store.select(selectFacets);
  decisions$ = this.store.select(selectDecisions);
  // Filtered views used by the template.
  filteredFacets$ = combineLatest([this.facets$, this.searchTerm$]).pipe(
    map(([facets, term]) => this.filterByLabel(facets, term)),
  );
  filteredDecisions$ = combineLatest([this.decisions$, this.searchTerm$]).pipe(
    map(([decisions, term]) => this.filterByLabel(decisions, term)),
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

  // Case-insensitive substring match on the facet label.
  private filterByLabel(facets: PlanPilotFacet[], term: string): PlanPilotFacet[] {
    const query = term.trim().toLowerCase();
    if (!query) {
      return facets;
    }
    return facets.filter((facet) => facet.label.toLowerCase().includes(query));
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
