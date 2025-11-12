import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { ComprehensionCheckQuestion, UserStudyComprehensionCheckStep, UserStudyStep } from '../../domain/user-study';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comprehension-check-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatCheckbox,
    MatSlider,
    MatSliderThumb
  ],
  templateUrl: './comprehension-check-card.component.html',
  styleUrl: './comprehension-check-card.component.scss'
})
export class ComprehensionCheckCardComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string | null>(null, [Validators.required]),
    time: this.fb.control<number>(1),
    questions: this.fb.array<FormGroup>([])
  });

  step = input.required<UserStudyComprehensionCheckStep>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  changes = output<UserStudyStep>();
  up = output<void>();
  down = output<void>();
  delete = output<void>();

  get questions(): FormArray {
    return this.form.controls.questions as FormArray;
  }

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      data => {
        const questions: ComprehensionCheckQuestion[] = (data.questions || []).map((q: any) => ({
          question: q.question || '',
          options: (q.options || []).map((o: any) => ({
            text: o.text || '',
            isCorrect: o.isCorrect || false
          }))
        }));

        this.changes.emit({
          type: this.step().type,
          name: data.name ?? 'Comprehension Check',
          time: data.time ? (data.time <= 60 ? data.time : (Math.floor(data.time / 60)*60)) : null,
          content: questions
        });
      }
    );
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.step().name);
    this.form.controls.time.setValue(this.step().time ?? 1);
    
    const content = this.step().content;
    if (content && Array.isArray(content)) {
      content.forEach(question => {
        this.addQuestion(question);
      });
    }
  }

  createQuestionGroup(question?: ComprehensionCheckQuestion): FormGroup {
    const group = this.fb.group({
      question: this.fb.control(question?.question || '', [Validators.required]),
      options: this.fb.array(
        question?.options?.map(opt => this.createOptionGroup(opt)) || []
      )
    });
    return group;
  }

  createOptionGroup(option?: { text: string, isCorrect: boolean }): FormGroup {
    return this.fb.group({
      text: this.fb.control(option?.text || '', [Validators.required]),
      isCorrect: this.fb.control(option?.isCorrect || false)
    });
  }

  addQuestion(question?: ComprehensionCheckQuestion): void {
    this.questions.push(this.createQuestionGroup(question));
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    const options = this.getOptions(questionIndex);
    options.push(this.createOptionGroup());
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  moveUp() {
    this.up.emit();
  }

  moveDown() {
    this.down.emit();
  }

  deletePart() {
    this.delete.emit();
  }

  formatLabel(value: number): string {
    if (value >= 60) {
      return Math.floor(value / 60) + 'm';
    }

    return value + 's';
  }

}

