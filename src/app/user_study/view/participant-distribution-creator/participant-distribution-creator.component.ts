import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { UserStudy } from "../../domain/user-study";
import { switchMap, takeUntil } from "rxjs/operators";
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { Store } from "@ngrx/store";
import { selectUserStudies } from "../../state/user-study.selector";
import { ParticipantDistribution, UserStudySelection } from "../../domain/participant-distribution";
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { PageModule } from "src/app/shared/components/page/page.module";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { createParticipantDistribution, loadUserStudies } from "../../state/user-study.actions";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "app-participant-distribution-creator",
  standalone: true,
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
  templateUrl: "./participant-distribution-creator.component.html",
  styleUrls: ["./participant-distribution-creator.component.scss"],
})
export class ParticipantDistributionCreatorComponent {

  store = inject(Store)
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

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
  }


  onAddStudy(){
    this.form.controls.userStudies.push(this.fb.group({
      userStudy: this.fb.control<string>(null, [Validators.required]),
      numberParticipants: this.fb.control<number>(null, [Validators.required]),
    }))
  }

  save(){
    const distribution: ParticipantDistribution ={
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      userStudies: this.form.controls.userStudies.controls.map(c => c.value)
    }

    this.store.dispatch(createParticipantDistribution({distribution}));

    this.router.navigate(['user-study', 'collection']);
  }

}
