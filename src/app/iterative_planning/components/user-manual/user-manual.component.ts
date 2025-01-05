import { Component, computed, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExplanationInterfaceType, GeneralSettings } from 'src/app/project/domain/general-settings';
import { PageModule } from 'src/app/shared/components/page/page.module';

@Component({
  selector: 'app-user-manual',
  imports: [
    MatTabsModule
  ],
  templateUrl: './user-manual.component.html',
  styleUrl: './user-manual.component.scss'
})
export class UserManualComponent {

  settings = input.required<GeneralSettings>();

  templatesManual = computed(() => this.settings()?.explanationInterfaceType === ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER);
  LLMManual = computed(() => this.settings()?.explanationInterfaceType === ExplanationInterfaceType.LLM_CHAT);

}
