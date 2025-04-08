import { Component, computed, input } from '@angular/core';
import { BelugaProblemZ } from '../../domain/beluga_problem';
import { array } from 'zod';
import { BelugaActionZ } from '../../domain/beluga_plan';
import { Plan } from 'src/app/planning/domain/plan';

@Component({
  selector: 'app-beluga-plan-animation',
  imports: [],
  templateUrl: './beluga-plan-animation.component.html',
  styleUrl: './beluga-plan-animation.component.scss'
})
export class BelugaPlanAnimationComponent {

	plan = input.required<Plan>();
	actions = computed(() => {
		let plan = this.plan();
		if(plan !== null && plan.actions !== undefined && plan.actions !== null ){
		return array(BelugaActionZ).parse(plan.actions);
		}
		return null;
	});

	model = input.required<unknown>();
	belugaProblem = computed(() => BelugaProblemZ.parse(this.model()))

}
