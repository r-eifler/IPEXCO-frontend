import { Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExecutionUserStudyStep } from '../../state/user-study-execution.selector';
import { map, filter } from 'rxjs';
import { UserStudyComprehensionCheckStep, UserStudyStepType } from 'src/app/user_study/domain/user-study';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { MatIconModule } from '@angular/material/icon';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { executionLockNextStep, executionUnlockNextStep } from '../../state/user-study-execution.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-comprehension-check-view',
  standalone: true,
  imports: [
    PageModule,
    MatIconModule,
    InfoComponent,
    AsyncPipe,
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './comprehension-check-view.component.html',
  styleUrl: './comprehension-check-view.component.scss'
})
export class ComprehensionCheckViewComponent {

  store = inject(Store);
  fb = inject(FormBuilder);

  step$ = this.store.select(selectExecutionUserStudyStep).pipe(
    map(s => s !== null && s.type === UserStudyStepType.comprehensionCheck ? s as UserStudyComprehensionCheckStep : null)
  );

  form: FormGroup;
  allCorrect = false;
  incorrectQuestions: number[] = [];
  private currentStep: UserStudyComprehensionCheckStep | null = null;

  constructor() {
    this.form = this.fb.group({
      questions: this.fb.array([])
    });

    // Lock the next step initially
    this.store.dispatch(executionLockNextStep());

    this.step$.pipe(
      takeUntilDestroyed(),
      filter(step => !!step)
    ).subscribe(step => {
      if (step && step.content) {
        this.currentStep = step;
        this.initializeForm(step);
      }
    });

    this.form.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.checkAllCorrect();
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  initializeForm(step: UserStudyComprehensionCheckStep): void {
    this.questions.clear();
    
    step.content.forEach(question => {
      const optionsArray = this.fb.array(
        question.options.map(option => this.fb.control(false))
      );
      
      const questionGroup = this.fb.group({
        options: optionsArray
      });
      
      this.questions.push(questionGroup);
    });
  }

  getOptionsArray(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  checkAllCorrect(): void {
    if (!this.currentStep || !this.currentStep.content) {
      this.allCorrect = false;
      this.incorrectQuestions = [];
      this.store.dispatch(executionLockNextStep());
      return;
    }

    let isCorrect = true;
    const incorrectIndices: number[] = [];

    this.currentStep.content.forEach((question, qIdx) => {
      const optionsArray = this.getOptionsArray(qIdx);
      let questionCorrect = true;
      
      question.options.forEach((option, oIdx) => {
        const isSelected = optionsArray.at(oIdx).value;
        
        // If the option should be selected but isn't, or shouldn't be selected but is
        if (option.isCorrect !== isSelected) {
          isCorrect = false;
          questionCorrect = false;
        }
      });

      if (!questionCorrect) {
        incorrectIndices.push(qIdx + 1); // 1-based index for display
      }
    });

    this.allCorrect = isCorrect;
    this.incorrectQuestions = incorrectIndices;

    // Lock or unlock the next step based on whether all answers are correct
    if (this.allCorrect) {
      this.store.dispatch(executionUnlockNextStep());
    } else {
      this.store.dispatch(executionLockNextStep());
    }
  }

  isQuestionIncorrect(questionIndex: number): boolean {
    return this.incorrectQuestions.includes(questionIndex + 1);
  }
}

