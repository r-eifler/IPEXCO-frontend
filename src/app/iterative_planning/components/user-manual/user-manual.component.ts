import { Component, computed, input, Signal } from '@angular/core';
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

  settings: Signal<GeneralSettings> = input(null);

  templatesManual = computed(() => 
    this.settings() ? this.settings()?.explanationInterfaceType === ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER : true
  );
  LLMManual = computed(
    () => this.settings() ? this.settings()?.explanationInterfaceType === ExplanationInterfaceType.LLM_CHAT : true
  );

}
