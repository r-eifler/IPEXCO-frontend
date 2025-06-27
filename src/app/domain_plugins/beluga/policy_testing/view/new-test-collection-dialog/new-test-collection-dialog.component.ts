import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, take } from 'rxjs';
import { TemplateFileUploadComponent } from 'src/app/components/files/file-upload/file-upload.component';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { FileUpload, TestCollectionBase, TestRunStatus } from '../../domain/test-case';
import { AsyncPipe } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { PolicyTestingTestCollectionsService } from '../../services/tests.service';

@Component({
  selector: 'app-new-test-collection-dialog',
  imports: [
    DialogModule,
    MatIconModule,
    TemplateFileUploadComponent,
    MatStepperModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
	AsyncPipe,
  ],
  templateUrl: './new-test-collection-dialog.component.html',
  styleUrl: './new-test-collection-dialog.component.scss'
})
export class NewTestCollectionDialogComponent {

	store = inject(Store);
	uploadService = inject(PolicyTestingTestCollectionsService);
	dialogRef = inject(MatDialogRef<NewTestCollectionDialogComponent>);

	private fb = inject(FormBuilder);

	form = this.fb.group({
		name: this.fb.control<string | null>(null, Validators.required),
		// description: this.fb.control<string | null>(null),
	});

	policyName$ = new BehaviorSubject<string | null>(null);
	policyFileUpload$ = new BehaviorSubject<FileUpload | null>(null);
	policyIsValid$ = this.policyFileUpload$.pipe(
		map(m => m !== null),
	)

	onPolicySelected(policy: File){
		console.log(policy)
		this.uploadService.uploadPolicy(policy).pipe(take(1)).subscribe(res => {
			console.log(res);
			this.policyFileUpload$.next(res);
		})
		
	}

	onFileName(name: string){
		this.policyName$.next(name);
	}

	onCancel(){
		this.dialogRef.close();
	}

	onSave(): void {
		console.log("onSave");
		combineLatest([this.policyFileUpload$, this.policyName$]).pipe(
			take(1),
			filter(([fileUpload, name]) => fileUpload !== null)
		).subscribe(
			([fileUpload, name]) => {

				if(fileUpload !== null){

					const newTestCollection: TestCollectionBase = {
						name: this.form.controls.name.value ?? 'TODO',
						policy: {
							name: name ?? 'unknown',
							modelFileName: fileUpload.filename
						},
						project: '',
						numFuzzStates: 0,
						testCases: [],
						status: TestRunStatus.PENDING
					};

					console.log(newTestCollection);

					this.dialogRef.close(newTestCollection);
				}

			}
		)
	}

}
