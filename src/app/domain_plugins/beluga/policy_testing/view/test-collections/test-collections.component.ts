import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectProject, selectTestCollections } from '../../state/policy-testing.selector';
import { TestCollectionCardComponent } from '../../components/test-collection-card/test-collection-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewTestCollectionDialogComponent } from '../new-test-collection-dialog/new-test-collection-dialog.component';
import { TestCollectionBase } from '../../domain/test-case';
import { createTestCollections, loadTestCollections } from '../../state/policy-testing.actions';

@Component({
  selector: 'app-test-collections',
  imports: [
    PageModule,
    ActionCardComponent,
    TestCollectionCardComponent,
    MatIconModule
  ],
  templateUrl: './test-collections.component.html',
  styleUrl: './test-collections.component.scss'
})
export class TestCollectionsComponent {

	store = inject(Store)
	dialog = inject(MatDialog)

	testCollections = this.store.selectSignal(selectTestCollections);
	project = this.store.selectSignal(selectProject)


	open_test_collection_dialog(){
	let ref = this.dialog.open(NewTestCollectionDialogComponent);
	ref.afterClosed().subscribe((test: undefined | TestCollectionBase) => {
		let project = this.project();
		if(test !== undefined && project !== undefined){
			let testCollection: TestCollectionBase = {
				...test,
				project: project._id
			}
			
			this.store.dispatch(createTestCollections({testCollection}))
		}
	})
	}
}
