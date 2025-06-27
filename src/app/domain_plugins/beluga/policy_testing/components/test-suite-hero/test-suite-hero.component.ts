import { Component, computed, input } from '@angular/core';
import { TestCollection } from '../../domain/test-case';
import { getNumberOfBugs } from '../../domain/utils';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-test-suite-hero',
  imports: [
    MatCardModule, 
    MatChipsModule,  
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatProgressBarModule,
    TranslocoModule
  ],
  templateUrl: './test-suite-hero.component.html',
  styleUrl: './test-suite-hero.component.scss'
})
export class TestSuiteHeroComponent {

  testSuite = input.required<TestCollection>();
  
  numBugs = computed(() => getNumberOfBugs(this.testSuite()))
  numTestStates = computed(() => this.testSuite()?.testCases?.length)

}
