import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { QuoteModule } from 'src/app/shared/component/quote/quote.module';
import { UnformattedModule } from 'src/app/shared/component/unformatted/unformatted.module';

import { PlanProperty } from '../../domain/plan-property/plan-property';

@Component({
  selector: 'app-plan-proeprty-panel',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, UnformattedModule, QuoteModule],
  templateUrl: './plan-proeprty-panel.component.html',
  styleUrl: './plan-proeprty-panel.component.scss'
})
export class PlanProeprtyPanelComponent {
  property = input.required<PlanProperty | null>();
}
