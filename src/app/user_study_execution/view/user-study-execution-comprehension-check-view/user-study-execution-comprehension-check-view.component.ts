import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { PageTitleComponent } from '../../../shared/components/page/page-title/page-title.component';
import { PageModule } from '../../../shared/components/page/page.module';
import { MarkedPipe } from '../../../pipes/marked.pipe';
import { AllowUrlPipe } from 'src/app/project/service/allow-url.service';
import { ComprehensionCheckQuestion, ComprehensionCheckQuestionAnswer  } from '../../domain/user-action';

import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';

import { NgIf, NgFor } from '@angular/common';

import { submitComprehensionCheck } from '../../state/user-study-execution.actions';

import { executionLockNextStep, executionUnlockNextStep } from '../../state/user-study-execution.actions';


import { ComprehensionCheckFormComponent } from '../comprehension-check-form/comprehension-check-form.component';

@Component({
  selector: 'app-user-study-execution-comprehension-check-view',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgFor,
    PageModule,
    PageTitleComponent,
    MarkedPipe,
    AllowUrlPipe,
    NgIf,
    NgFor,
    ComprehensionCheckFormComponent
  ],
  templateUrl: './user-study-execution-comprehension-check-view.component.html',
  styleUrl: './user-study-execution-comprehension-check-view.component.scss'
})
export class UserStudyExecutionComprehensionCheckViewComponent {
  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);

  questionForm!: FormGroup;

  preVideoText = `
  Please answer the following comprehension check questions.
  You must answer all questions correctly in order to continue the study.
  You have two attempts -- if you fail to answer all questions correctly after two attempts you will be asked to return your submission.
  Feel free to rewatch the instructions if you are unsure about any of the answers.`;

  preComprehensionCheckText = `Please answer the following comprehension check questions. You must answer all questions correctly in order to continue the study. You have two attempts -- if you fail to answer all questions correctly after two attempts you will be asked to return your submission. Feel free to rewatch the instructions if you are unsure about any of the answers.`

  preSecondAttemptText = `You did not answer all questions correctly. You can try once more.
  If you fail again, you will be asked to return your submission.
  Remember that you can rewatch the instructions if needed.`

  constructor(private fb: FormBuilder) {
    // do not allow user to move on (until they pass the comprehension check)
    this.store.dispatch(executionLockNextStep());
  }

  readonly questions: ReadonlyArray<ComprehensionCheckQuestion> = [
    { id: "q1", text: "Your job is to select goals for the rover to achieve.", correctAnswer: "true" },
    { id: "q2", text: "Some of the rover's goals are more valuable than others, i.e., they have higher utility.", correctAnswer: "true" },
    { id: "q3", text: "Once goals are enforced you must manually make plans that achieve the chosen goals.", correctAnswer: "false" },
    { id: "q4", text: "The utility of a step is only available if the enforced goals can all be achieved.", correctAnswer: "true" },
    { id: "q5", text: "Suppose you enforced 4 goals and the planner failed to find a solution. The explanation is a single set of conflicts between the 4 goals. In such situations, is it always the case that you only need to remove 1 of the 4 goals and the planner will be able to find a solution for the remaining 3 goals?", correctAnswer: "true" }
  ];

  buildForm(): FormGroup {
    const group: { [key: string]: any } = {};
    this.questions.forEach(q => group[q.id] = [null, Validators.required]);
    return this.fb.group(group);
  }

  // HACK: variables are hard-coded to support 2 attempts
  currentAttempt: number = 0;
  finalAttempt: number = 1;
  passingScore = this.questions.length;
  attemptForms: FormGroup[] = [this.buildForm(), this.buildForm()];
  questionAnswers: ComprehensionCheckQuestionAnswer[][] = [
    this.questions.map(q => ({ ...q, userAnswer: undefined })),
    this.questions.map(q => ({ ...q, userAnswer: undefined }))
  ];
  submittedForm: boolean[] = [false, false]

  // Questions to show for current attempt
  displayedQuestions: ComprehensionCheckQuestion[] = [];

  passed = false;

  submitAttempt(): void {
    const currentForm = this.attemptForms[this.currentAttempt];
    const currentQuestionAnswers = this.questionAnswers[this.currentAttempt];

    currentForm.disable();
    this.submittedForm[this.currentAttempt] = true;

    // Extract answers from form and put them into currentQuestionAnswers
    Object.keys(currentForm.value).forEach(id => {
      const question = currentQuestionAnswers.find(q => q.id === id);
      if (!question) {
        console.error("The form has questions that aren't in the question set...");
        return;
      }
      question.userAnswer = currentForm.value[id];
    });

    // Compute score
    const score = currentQuestionAnswers.filter(q => q.userAnswer === q.correctAnswer).length;

    // console.log('Submission:', currentQuestionAnswers);
    // console.log('Score:', score);

    // Save answers to store
    this.store.dispatch(submitComprehensionCheck({ submission: currentQuestionAnswers }));

    // User PASSED in this attempt
    if (score >= this.passingScore) {
      this.passed = true;
      this.store.dispatch(executionUnlockNextStep());
    }

    // User FAILED in this attempt
    else {
      this.currentAttempt += 1;
    }

  }

}
