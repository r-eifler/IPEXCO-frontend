import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TraceInspectorComponent } from '../../../shared/components/trace-inspector/trace-inspector.component';
import { BelugaActionType } from '../../../shared/domain/beluga_plan';
import { getSiteSetUp } from '../../../shared/domain/site_set_up';
import { getFullStartStateFromTestCase } from '../../domain/utils';
import { selectProjectId, selectSection, selectSelectedTestCase, selectSelectedTestSuite } from '../../state/policy-testing.selector';


@Component({
  selector: 'app-policy-trace-inspection',
  imports: [
    PageModule,
    BreadcrumbModule,
    RouterLink,
    MatExpansionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    TraceInspectorComponent,
	TranslocoModule,
  ],
  templateUrl: './policy-trace-inspection.component.html',
  styleUrl: './policy-trace-inspection.component.scss'
})
export class PolicyTraceInspectionComponent {

	store = inject(Store)

	projectId = this.store.selectSignal(selectProjectId);
	testSuite = this.store.selectSignal(selectSelectedTestSuite);
	testCase = this.store.selectSignal(selectSelectedTestCase)

	section = computed(() => {
		const sectionId = this.testSuite()?.flightSection;
		if(sectionId !== undefined){
		return this.store.selectSignal(selectSection(sectionId))();
		}
		return undefined;
	})

	configuration = computed(() => {
		const index = this.section()?.configurationIndex;
		if(index === undefined){
			return undefined;
		}
		return this.section()?.configurations[index];
		})

	actions = computed(() => this.testCase()?.policyTrace?.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

	startState = computed(() => getFullStartStateFromTestCase(this.section(), this.testCase()))

	siteSetUp = computed(() => {
		const problem = this.testCase()?.problem
		if(problem !== undefined)
			return getSiteSetUp(problem);
		return undefined;
	})

	flightSchedule = computed(() => {
		const problem = this.testCase()?.problem
		if(problem !== undefined)
			return problem.flights[0];
		return undefined;
	})

	productionSchedule = computed(() => {
		const problem = this.testCase()?.problem
		if(problem !== undefined)
			return problem.production_lines;
		return undefined;
	})

	constructor(){
		effect(() => console.log(this.testCase()))
	}
}
