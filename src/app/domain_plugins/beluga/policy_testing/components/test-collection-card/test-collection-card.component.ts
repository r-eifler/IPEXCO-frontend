import { Component, computed, effect, input } from '@angular/core';
import { TestSuite } from '../../domain/tests';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getNumberOfBugs } from '../../domain/utils';
import { FlightsHorizon } from '../../../flight-section-planning/domain/flight-section';

@Component({
  selector: 'app-test-collection-card',
  imports: [
    MatCardModule, 
    MatChipsModule,  
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    RouterLink, 
    MatTooltipModule, 
    MatProgressBarModule,
    TranslocoModule
  ],
  templateUrl: './test-collection-card.component.html',
  styleUrl: './test-collection-card.component.scss'
})
export class TestCollectionCardComponent {

  testSuite = input.required<TestSuite>();
  flightSection = input.required<FlightsHorizon>();

  numBugs = computed(() => getNumberOfBugs(this.testSuite()))
  numTestStates = computed(() => this.testSuite()?.testCases.length)
  flightIndex = computed(() => this.flightSection()?.flightIndices)

  constructor() {
    effect(() => console.log(this.flightSection()))
  }
}
