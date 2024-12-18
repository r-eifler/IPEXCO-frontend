import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { QuoteModule } from 'src/app/shared/components/quote/quote.module';
import { UnformattedModule } from 'src/app/shared/components/unformatted/unformatted.module';

import { PlanProperty } from '../../domain/plan-property/plan-property';

@Component({
    selector: 'app-plan-property-panel',
    imports: [MatExpansionModule, MatIconModule, UnformattedModule, QuoteModule],
    templateUrl: './plan-property-panel.component.html',
    styleUrl: './plan-property-panel.component.scss'
})
export class PlanPropertyPanelComponent {
  property = input.required<PlanProperty | null>();
}
