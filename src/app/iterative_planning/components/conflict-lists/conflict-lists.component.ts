import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlanPropertyBadgeComponent } from 'src/app/shared/components/plan-property-badge/plan-property-badge.component';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';

@Component({
  selector: 'app-conflict-lists',
  imports: [
    MatIconModule,
    PlanPropertyBadgeComponent,
  ],
  templateUrl: './conflict-lists.component.html',
  styleUrl: './conflict-lists.component.scss'
})
export class ConflictListsComponent {

  questionArgument = input<string>(null)
  answer = input.required<string[][] | null>();
  planProperties = input.required<Record<string,PlanProperty>>();

  hasConflict = computed(() => this.answer()?.length > 0);
  hasNoConflict = computed(() => this.answer()?.length == 0);

  questionArgumentName  = computed(() => {
    const arg = this.questionArgument();
    console.log(arg);
    if(arg != null){
      return this.planProperties()[arg]?.name;
    }
    return null
  })

}
