import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgentType, Prompt, PromptType } from '../../domain/prompt';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';

@Component({
  selector: 'app-prompt-creator',
  imports: [
    DialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './prompt-creator.component.html',
  styleUrl: './prompt-creator.component.scss'
})
export class PromptCreatorComponent {

  dialogRef = inject(MatDialogRef);
    data: {
      domains: {_id: string, name: string}[],
      explainer: {_id: string, name: string}[]
    } = inject(MAT_DIALOG_DATA);
  
    agentTypes = [
      AgentType.GOAL_TRANSLATOR,
      AgentType.QUESTION_CLASSIFIER,
      AgentType.EXPLANATION_TRANSLATOR,
    ]

    promptTypes = [
      PromptType.SYSTEM,
      PromptType.INSTRUCTION_AND_EXAMPLES,
      PromptType.INPUT_DATA
    ]
  
    fb = inject(FormBuilder);
  
    form = this.fb.group({
        name: this.fb.control<string>(null, Validators.required),
        agent: this.fb.control<AgentType>(null, Validators.required),
        type: this.fb.control<PromptType>(null, Validators.required),
        domain: this.fb.control<string>(null),
        explainer:  this.fb.control<string>(null),
    });
  
    onCancel(){
      this.dialogRef.close();
    }
  
    onCreate(){
      const prompt: Prompt = {
        name: this.form.controls.name.value,
        agent: this.form.controls.agent.value,
        type: this.form.controls.type.value,
        domain: this.form.controls.domain.value,
        explainer: this.form.controls.explainer.value,
        text: ''
      }
      this.dialogRef.close(prompt)
    }

}
