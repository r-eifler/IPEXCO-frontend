import {Component, inject} from '@angular/core';
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType,
} from '../../domain/user-study';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import {PageModule} from '../../../shared/components/page/page.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {BreadcrumbModule} from '../../../shared/components/breadcrumb/breadcrumb.module';
import {Store} from '@ngrx/store';
import {selectUserStudyDemos} from '../../state/user-study.selector';
import {createUserStudy, loadUserStudyDemos} from '../../state/user-study.actions';
import {AsyncPipe} from '@angular/common';
import {DescriptionCardComponent} from '../../components/description-card/description-card.component';
import {DemoCardComponent} from '../../components/demo-card/demo-card.component';
import {FormCardComponent} from '../../components/form-card/form-card.component';
import {selectedAtLeastOne} from '../../../validators/selected-at-least-one.validator';
import {isNoPropertyNull} from '../../../validators/no-property-null.validator';
import { UserManualCardComponent } from '../../components/user-manual-card/user-manual-card.component';
import { DemoInfoCardComponent } from '../../components/demo-info-card/demo-info-card.component';


@Component({
    selector: 'app-user-study-creator',
    providers: [provideNativeDateAdapter()],
    imports: [
        PageModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        FormsModule,
        MatTabsModule,
        MatInputModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        RouterLink,
        MatDatepickerModule,
        AsyncPipe,
        DescriptionCardComponent,
        DemoCardComponent,
        FormCardComponent,
        UserManualCardComponent,
        DemoInfoCardComponent,
    ],
    templateUrl: './user-study-creator.component.html',
    styleUrls: ['./user-study-creator.component.scss']
})
export class UserStudyCreatorComponent {

  userStudyStepType = UserStudyStepType;
  store = inject(Store)
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  demos$ = this.store.select(selectUserStudyDemos)

  form = this.fb.group({
    name: this.fb.control<string>(null, [Validators.required]),
    description: this.fb.control<string>('TODO', [Validators.required]),
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
  }

  addNewStep(type: UserStudyStepType) {
    const newPart: UserStudyStep = {
      type,
      name: null,
      time: null,
      content: null
    };
    console.log(newPart);
    this.form.controls.steps.push(this.fb.control<UserStudyStep>(newPart, [isNoPropertyNull]));
  }

  updateControl(control: FormControl<UserStudyStep>, step: UserStudyStep) {
    control.setValue(step);
  }

  deleteStep(index: number) {
    this.form.controls.steps.removeAt(index);
  }

  moveUp(index: number){
    if(index === 0){
      return;
    }
    const value: UserStudyStep = this.form .controls.steps.controls[index].value;
    this.form .controls.steps.removeAt(index);
    this.form.controls.steps.insert(index - 1, this.fb.control<UserStudyStep>(value));
  }

  moveDown(index: number){
    if(index === this.form.controls.steps.length - 1) {
      return;
    }
    const value: UserStudyStep = this.form .controls.steps.controls[index].value;
    this.form .controls.steps.removeAt(index);
    this.form.controls.steps.insert(index + 1, this.fb.control<UserStudyStep>(value));
  }


  save() {
    const userStudy: UserStudy = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      relatedProject: this.form.controls.relatedProject.value,
      expectation: this.form.controls.expectation.value,
      confidentiality: this.form.controls.confidentiality.value,
      startDate: this.form.controls.validTimeRange.controls.start.value,
      endDate: this.form.controls.validTimeRange.controls.end.value,
      redirectUrl: this.form.controls.redirectUrl.value,
      steps: this.form.controls.steps.value
    };

    this.store.dispatch(createUserStudy({userStudy}));
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
