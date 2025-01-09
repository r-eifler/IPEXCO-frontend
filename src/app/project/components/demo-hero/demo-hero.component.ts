import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Demo, computeMaxPossibleUtility } from 'src/app/project/domain/demo';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { StepValuePipe } from 'src/app/iterative_planning/domain/pipe/step-value.pipe';
import { DefaultPipe } from 'src/app/shared/common/pipe/default.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { DemoStatusColorPipe } from '../../pipe/demo-status-color.pipe';
import { DemoStatusNamePipe } from '../../pipe/demo-status-name.pipe';

@Component({
    selector: 'app-demo-hero',
    imports: [
        MatCardModule,
        MatChipsModule,
        DemoStatusColorPipe,
        DemoStatusNamePipe,
        MatIconModule,
        LabelModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    templateUrl: './demo-hero.component.html',
    styleUrl: './demo-hero.component.scss'
})
export class DemoHeroComponent {

  demo = input.required<Demo>();
  planProperties = input.required<PlanProperty[]>();

  numPlanProperties  = computed(() => this.planProperties()?.length);
  numConflicts = computed(() => this.demo()?.globalExplanation?.MUGS?.length);
  numCorrections = computed(() => this.demo()?.globalExplanation.MGCS?.length);

  maxUtility = computed(() => computeMaxPossibleUtility(this.demo(), this.planProperties()))

}
