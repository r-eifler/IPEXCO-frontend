import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectProject, selectSections, selectTestCollections } from '../../state/policy-testing.selector';
import { TestCollectionCardComponent } from '../../components/test-collection-card/test-collection-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewTestCollectionDialogComponent } from '../new-test-collection-dialog/new-test-collection-dialog.component';
import { TestSuiteBase } from '../../domain/tests';
import { createTestCollections, loadFlightPlanTree, loadTestCollections } from '../../state/policy-testing.actions';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-collections',
  imports: [
    PageModule,
    ActionCardComponent,
    TestCollectionCardComponent,
    MatIconModule,
	BreadcrumbModule,
	RouterLink,
  ],
  templateUrl: './test-collections.component.html',
  styleUrl: './test-collections.component.scss'
})
export class TestCollectionsComponent {

	store = inject(Store)
	dialog = inject(MatDialog)

	testSuites = this.store.selectSignal(selectTestCollections);
	project = this.store.selectSignal(selectProject)
	flightSections = this.store.selectSignal(selectSections);

	open_test_collection_dialog(){
		let ref = this.dialog.open(NewTestCollectionDialogComponent);
		ref.afterClosed().subscribe((test: undefined | TestSuiteBase) => {
			let project = this.project();
			if(test !== undefined && project !== undefined){
				let testCollection: TestSuiteBase = {
					...test,
					project: project._id
				}
				
				this.store.dispatch(createTestCollections({testCollection}))
			}
		})
	}
}
