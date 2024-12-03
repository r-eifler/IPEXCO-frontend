import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { QuoteModule } from 'src/app/shared/component/quote/quote.module';
import { UnformattedModule } from 'src/app/shared/component/unformatted/unformatted.module';

import { PlanProperty } from '../../../iterative_planning/domain/plan-property/plan-property';

@Component({
  selector: 'app-plan-property-panel',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, UnformattedModule, QuoteModule],
  templateUrl: './plan-property-panel.component.html',
  styleUrl: './plan-property-panel.component.scss'
})
export class PlanPropertyPanelComponent {
  property = input.required<PlanProperty | null>();
}
