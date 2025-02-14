import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { DemoStatusColorPipe } from '../../pipe/demo-status-color.pipe';
import { DemoStatusNamePipe } from '../../pipe/demo-status-name.pipe';
import { computeMaxPossibleUtility, Demo } from 'src/app/shared/domain/demo';

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
  numCorrections = computed(() => this.demo()?.globalExplanation?.MGCS?.length ?? undefined);

  maxUtility = computed(() => computeMaxPossibleUtility(this.demo(), this.planProperties()))

}
