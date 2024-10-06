import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  private fb = inject(FormBuilder);

  userInput = output<string>();

  form = this.fb.group({
    input: this.fb.control<string>('', Validators.required),
  });

  onSubmit(): void {
    if(this.form.invalid) {
      return;
    }

    this.userInput.emit(this.form.controls.input.value);

    this.form.controls.input.setValue('');
  }

  onKeyPress(event: KeyboardEvent) {
    if (!(event.code === 'Enter')) {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    this.onSubmit();
  }
}
