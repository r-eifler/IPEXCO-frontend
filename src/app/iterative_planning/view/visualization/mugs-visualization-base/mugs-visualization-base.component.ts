import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { explanationVisualizationRequested } from 'src/app/iterative_planning/state/iterative-planning.actions';

@Component({
  selector: 'app-mugs-visualization-base',
  standalone: true,
  imports: [],
  templateUrl: './mugs-visualization-base.component.html',
  styleUrl: './mugs-visualization-base.component.scss'
})
export class MugsVisualizationBaseComponent {

  store = inject(Store);

  step = input.required<IterationStep>();

  explanationsAvailable = computed(() => !!this.step().globalExplanation)
  globalExplanation = computed(() => this.step().globalExplanation)


  computeExplanations(){
    this.store.dispatch(explanationVisualizationRequested({iterationStepId: this.step()._id}))
  }

}
