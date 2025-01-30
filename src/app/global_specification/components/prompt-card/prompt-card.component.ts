import { Component, computed, input } from '@angular/core';
import { Prompt } from '../../domain/prompt';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-prompt-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './prompt-card.component.html',
  styleUrl: './prompt-card.component.scss'
})
export class PromptCardComponent {

  prompt = input.required<Prompt>();
  domains = input.required<{_id: string, name: string}[]>();
  explainer = input.required<{_id: string, name: string}[]>();

  domainName = computed(() => this.domains()?.filter(e => e._id == this.prompt().domain)[0].name)
  explainerName = computed(() => this.explainer()?.filter(e => e._id == this.prompt().explainer)[0].name)

}
