import { Component, computed, input } from '@angular/core';
import { TestCollection } from '../../domain/test-case';
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

  testCollection = input.required<TestCollection>();

  numBugs = computed(() => getNumberOfBugs(this.testCollection()))
  numTestStates = computed(() => this.testCollection()?.testCases.length)
}
