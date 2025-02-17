import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserStudies, selectUserStudyParticipantDistribution } from '../../state/user-study.selector';
import { isNonEmptyValidator } from 'src/app/validators/non-empty.validator';
import { ParticipantDistribution } from '../../domain/participant-distribution';
import { editParticipantDistribution, loadUserStudies } from '../../state/user-study.actions';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect } from '@angular/material/select';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';

@Component({
    selector: 'app-participant-distribution-editor',
    imports: [
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        FormsModule,
        MatLabel,
        MatFormFieldModule,
        MatOptionModule,
        ReactiveFormsModule,
        PageModule,
        BreadcrumbModule,
        RouterLink,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        AsyncPipe,
        MatSelect,
    ],
    templateUrl: './participant-distribution-editor.component.html',
    styleUrl: './participant-distribution-editor.component.scss'
})
export class ParticipantDistributionEditorComponent {

  store = inject(Store)
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  participantDistribution$ = this.store.select(selectUserStudyParticipantDistribution);

  userStudies$ = this.store.select(selectUserStudies)

  form = this.fb.group({
    name: this.fb.control<string>(null, [Validators.required]),
    description: this.fb.control<string>('TODO', [Validators.required]),
    userStudies: this.fb.array<FormGroup<{
      userStudy: FormControl<string>,
      numberParticipants: FormControl<number>,
    }>>([], isNonEmptyValidator)
  });

  constructor(){
    this.store.dispatch(loadUserStudies());

    this.participantDistribution$.pipe(
      takeUntilDestroyed(),
      filter(distribution => !!distribution)
    ).subscribe( distribution => this.initForm(distribution));
  }

  initForm(distribution: ParticipantDistribution){
    this.form.controls.name.setValue(distribution.name);
    this.form.controls.description.setValue(distribution.description);

    distribution.userStudies.forEach(study => this.form.controls.userStudies.push(this.fb.group({
      userStudy: this.fb.control(study.userStudy, [Validators.required]),
      numberParticipants: this.fb.control<number>(study.numberParticipants, [Validators.required])
    })));
  }


  onAddStudy(){
    this.form.controls.userStudies.push(this.fb.group({
      userStudy: this.fb.control<string>(null, [Validators.required]),
      numberParticipants: this.fb.control<number>(null, [Validators.required]),
    }))
  }

  save(){
    this.participantDistribution$.pipe(take(1)).subscribe(
      distribution => {
        const newDistribution: ParticipantDistribution ={
          ...distribution,
          name: this.form.controls.name.value,
          description: this.form.controls.description.value,
          userStudies: this.form.controls.userStudies.controls.map(c => c.value)
        }
    
        this.store.dispatch(editParticipantDistribution({distribution: newDistribution}));
    
        this.router.navigate(['..', 'details'], {relativeTo: this.route});
      }
    );
    
  }

}
