import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import {DemoCardComponent} from '../../components/demo-card/demo-card.component';
import {DescriptionCardComponent} from '../../components/description-card/description-card.component';
import {FormCardComponent} from '../../components/form-card/form-card.component';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker, MatEndDate, MatStartDate} from '@angular/material/datepicker';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {UserStudy, UserStudyStep, UserStudyStepType} from '../../domain/user-study';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {selectUserStudy, selectUserStudyDemos} from '../../state/user-study.selector';
import {selectedAtLeastOne} from '../../../validators/selected-at-least-one.validator';
import { editUserStudy, loadUserStudyDemos} from '../../state/user-study.actions';
import {isNoPropertyNull} from '../../../validators/no-property-null.validator';
import {PageModule} from '../../../shared/components/page/page.module';
import {provideNativeDateAdapter} from '@angular/material/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter, take} from 'rxjs/operators';
import { UserManualCardComponent } from '../../components/user-manual-card/user-manual-card.component';
import { DemoInfoCardComponent } from '../../components/demo-info-card/demo-info-card.component';

@Component({
    selector: 'app-user-study-editor',
    providers: [provideNativeDateAdapter()],
    imports: [
        AsyncPipe,
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        DemoCardComponent,
        DescriptionCardComponent,
        FormCardComponent,
        FormsModule,
        MatButton,
        MatDateRangeInput,
        MatDateRangePicker,
        MatDatepickerToggle,
        MatEndDate,
        MatFormField,
        MatHint,
        MatIcon,
        MatInput,
        MatLabel,
        MatStartDate,
        MatSuffix,
        PageModule,
        ReactiveFormsModule,
        RouterLink,
        UserManualCardComponent,
        DemoInfoCardComponent,
    ],
    templateUrl: './user-study-editor.component.html',
    styleUrl: './user-study-editor.component.scss'
})
export class UserStudyEditorComponent {

  userStudyStepType = UserStudyStepType;
  store = inject(Store)
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  userStudy$ = this.store.select(selectUserStudy);
  demos$ = this.store.select(selectUserStudyDemos);

  form = this.fb.group({
    name: this.fb.control<string>('', [Validators.required]),
    description: this.fb.control<string>('', [Validators.required]),
    relatedProject: this.fb.control<string>('TODO', [Validators.required]),
    expectation: this.fb.control<string>('TODO', [Validators.required]),
    confidentiality: this.fb.control<string>('TODO', [Validators.required]),
    validTimeRange: this.fb.group({
      start: this.fb.control<Date | null>(null, [Validators.required]),
      end: this.fb.control<Date | null>(null, [Validators.required]),
    }),
    redirectUrl: this.fb.control('', []),
    steps: this.fb.array<UserStudyStep>([], [selectedAtLeastOne])
  });

  steps$ = this.form.controls.steps.valueChanges;

  constructor() {
    this.store.dispatch(loadUserStudyDemos());

    this.userStudy$.pipe(
      takeUntilDestroyed(),
      filter(study => !!study)
    ).subscribe(study => this.initForm(study));
  }

  initForm(study: UserStudy){
    this.form.controls.name.setValue(study.name);
    this.form.controls.description.setValue(study.description);
    this.form.controls.relatedProject.setValue(study.relatedProject);
    this.form.controls.expectation.setValue(study.expectation);
    this.form.controls.confidentiality.setValue(study.confidentiality);
    this.form.controls.redirectUrl.setValue(study.redirectUrl);
    this.form.controls.validTimeRange.controls.start.setValue(study.startDate);
    this.form.controls.validTimeRange.controls.end.setValue(study.endDate);

    study.steps.forEach(step => this.form.controls.steps.push(this.fb.control<UserStudyStep>(step, [isNoPropertyNull])));
  }

  addNewStep(type: UserStudyStepType) {
    const newStep: UserStudyStep = {
      type,
      name: '',
      time: null,
    };
    this.form.controls.steps.push(this.fb.control<UserStudyStep>(newStep, [isNoPropertyNull]));
  }

  updateControl(control: FormControl<UserStudyStep | null>, step: UserStudyStep | null) {
    if(step == null){
      return;
    }
    control.setValue(step);
  }

  deleteStep(index: number) {
    this.form.controls.steps.removeAt(index);
  }

  moveUp(index: number){
    if(index === 0){
      return;
    }
    const value = this.form .controls.steps.controls[index].value;
    if(value == null){
      return;
    }
    this.form .controls.steps.removeAt(index);
    this.form.controls.steps.insert(index - 1, this.fb.control<UserStudyStep>(value));
  }

  moveDown(index: number){
    if(index === this.form.controls.steps.length - 1) {
      return;
    }
    const value = this.form .controls.steps.controls[index].value;
    if(value == null){
      return;
    }
    this.form .controls.steps.removeAt(index);
    this.form.controls.steps.insert(index + 1, this.fb.control<UserStudyStep>(value));
  }


  save() {
    this.userStudy$.pipe(take(1)).subscribe(study => {

      if(study === undefined){
        console.error('No study available!');
        return;
      }

      const updatedStudy: UserStudy = {
        ...study,
        name: this.form.controls.name.value as string ?? 'TODO',
        description: this.form.controls.description.value as string ?? 'TODO',
        relatedProject: this.form.controls.relatedProject.value as string ?? 'TODO',
        expectation: this.form.controls.expectation.value as string ?? 'TODO',
        confidentiality: this.form.controls.confidentiality.value as string ?? 'TODO',
        startDate: this.form.controls.validTimeRange.controls.start.value,
        endDate: this.form.controls.validTimeRange.controls.end.value,
        redirectUrl: this.form.controls.redirectUrl.value,
        steps: (this.form.controls.steps.value as UserStudyStep[]) ?? []
      };

      this.store.dispatch(editUserStudy({userStudy: updatedStudy}));
        this.router.navigate(['user-study', study._id, 'details']);
    })

  }

}
