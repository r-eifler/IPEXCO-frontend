import { Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TestCasePanelComponent } from '../../components/test-case-panel/test-case-panel.component';
import { selectSelectedTestSuite } from '../../state/policy-testing.selector';
import { MatButtonModule } from '@angular/material/button';
import { startTestStateFuzzing } from '../../state/policy-testing.actions';
import { TestSuiteHeroComponent } from '../../components/test-suite-hero/test-suite-hero.component';
import { TestRunStatus } from '../../domain/test-case';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './test-collection-details.component.html',
  styleUrl: './test-collection-details.component.scss'
})
export class TestCollectionDetailsComponent {

  store = inject(Store)
  testSuite = this.store.selectSignal(selectSelectedTestSuite)

  testCases = computed(() => this.testSuite()?.testCases)

  isIdle = computed(() => this.testSuite()?.status === TestRunStatus.FINISHED)
  isRunning = computed(() => this.testSuite()?.status === TestRunStatus.RUNNING)

  numberOfFuzzedStates = 5;

  startFuzzing(){
    const testSuiteId = this.testSuite()?._id
    const num = this.numberOfFuzzedStates;
    if(testSuiteId !== undefined){
      this.store.dispatch(startTestStateFuzzing({testSuiteId, numberOfFuzzedStates: num}))
    }
  }

}
