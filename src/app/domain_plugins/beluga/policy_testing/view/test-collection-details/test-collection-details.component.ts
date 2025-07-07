import { Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TestCasePanelComponent } from '../../components/test-case-panel/test-case-panel.component';
import { selectProjectId, selectSelectedTestSuite } from '../../state/policy-testing.selector';
import { MatButtonModule } from '@angular/material/button';
import { resetTestCollection, startTestStateFuzzing } from '../../state/policy-testing.actions';
import { TestSuiteHeroComponent } from '../../components/test-suite-hero/test-suite-hero.component';
import { TestRunStatus } from '../../domain/tests';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TestResultsPlotsComponent } from '../../components/test-results-plots/test-results-plots.component';
import { number } from 'zod';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-test-collection-details',
  imports: [
    PageModule,
    BreadcrumbModule,
    MatIconModule,
    RouterLink,
    MatExpansionModule,
    TestCasePanelComponent,
    InfoComponent,
    MatButtonModule,
    TestSuiteHeroComponent,
    MatProgressBarModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    FormsModule,
    TestResultsPlotsComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './test-collection-details.component.html',
  styleUrl: './test-collection-details.component.scss'
})
export class TestCollectionDetailsComponent {

  store = inject(Store)

  projectId = this.store.selectSignal(selectProjectId);

  testSuite = this.store.selectSignal(selectSelectedTestSuite)

  allTestCases = computed(() => this.testSuite()?.testCases)

  bugs = computed(() => this.allTestCases()?.filter(tc => tc.classifiedAdBug))
  nonBugs = computed(() => this.allTestCases()?.filter(tc => ! tc.classifiedAdBug))

  hasRun = computed(() => this.testSuite()?.status === TestRunStatus.FINISHED || this.testSuite()?.status === TestRunStatus.FAILED)
  isIdle = computed(() => this.testSuite()?.status === TestRunStatus.FINISHED || this.testSuite()?.status === TestRunStatus.PENDING)
  isRunning = computed(() => this.testSuite()?.status === TestRunStatus.RUNNING)

  fractionFuzzedStates = computed(() => {
    const toFuzz = this.testSuite()?.numFuzzStates;
    const fuzzedAndFinishedTestCases =  this.testSuite()?.testCases.length
    if(toFuzz === undefined || fuzzedAndFinishedTestCases === undefined){
      return 0
    }
    const res = Math.round((fuzzedAndFinishedTestCases / toFuzz) * 100)
    return res;
  })

  numberToFuzzStates = 5;

  startFuzzing(){
    const testSuiteId = this.testSuite()?._id
    const num = this.numberToFuzzStates;
    if(testSuiteId !== undefined){
      this.store.dispatch(startTestStateFuzzing({testSuiteId, numberOfFuzzedStates: num}))
    }
  }

  reset(){
    const suiteId = this.testSuite()?._id
    if(suiteId !== undefined){
      this.store.dispatch(resetTestCollection({suiteId}))
    }
  }

}
