import { Component, computed, input } from '@angular/core';
import { PlanSection } from '../../../builder/domain/plan';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-section-card',
  imports: [
    TranslocoModule
  ],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss'
})
export class SectionCardComponent {

  index = input.required<number>();
  section = input.required<PlanSection>();
  isModified = input<boolean>(false);

  numActions = computed(() => this.section()?.actions.length)
}
