import { Component, input } from '@angular/core';
import { PlanProperty } from '../../domain/plan-property/plan-property';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { QuoteModule } from '../quote/quote.module';
import { UnformattedModule } from '../unformatted/unformatted.module';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-plan-property-badge',
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule, 
    UnformattedModule, 
    QuoteModule
  ],
  templateUrl: './plan-property-badge.component.html',
  styleUrl: './plan-property-badge.component.scss'
})
export class PlanPropertyBadgeComponent {

  property = input.required<PlanProperty | null>();

}
