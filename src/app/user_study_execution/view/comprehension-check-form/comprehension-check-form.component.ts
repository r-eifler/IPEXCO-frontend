import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComprehensionCheckQuestion } from '../../domain/user-action';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comprehension-check-form',
  templateUrl: './comprehension-check-form.component.html',
  styleUrls: ['./comprehension-check-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ComprehensionCheckFormComponent {
  @Input() form!: FormGroup;
  @Input() questions: ComprehensionCheckQuestion[] = [];
  @Input() submitted = false;
  @Input() title = '';

  @Output() submitForm = new EventEmitter<void>();

  onSubmit(): void {
    this.submitForm.emit();
  }
}
