import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {PageModule} from '../../../shared/components/page/page.module';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudy} from '../../state/user-study-execution.selector';
import {AsyncPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs';
import { executionSaveProlificId } from '../../state/user-study-execution.actions';
import { TranslocoModule } from '@jsverse/transloco';
import { changeLanguage } from 'src/app/user/state/user.actions';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
    selector: 'app-user-study-execution-start-view',
    imports: [
        PageModule,
        AsyncPipe,
        MatButtonModule,
        RouterLink,
        InfoComponent,
        MatIconModule,
        TranslocoModule,
        MatFormField,
        MatInputModule,
        FormsModule,
    ],
    templateUrl: './user-study-execution-start-view.component.html',
    styleUrl: './user-study-execution-start-view.component.scss'
})
export class UserStudyExecutionStartViewComponent {

  store = inject(Store);

  activatedRoute = inject(ActivatedRoute);
  userCode: WritableSignal<string|null> = signal(null);
  hasCode = computed(() => this.userCode() !== null && (this.userCode()?.length ?? 0) > 3)

  userStudy$ = this.store.select(selectExecutionUserStudy);

  constructor() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe(paramMap => {
      const id = paramMap.get("PROLIFIC_PID");
      if(id !== null){
        this.store.dispatch(executionSaveProlificId({id}));
      }
    })
  }

  storeCode(){
    const code = this.userCode();
    if(code !== null){
      this.store.dispatch(executionSaveProlificId({id: code}));
    }
  }
  
  setLanguage(code: string){
    console.log('Language: ' + code)
    this.store.dispatch(changeLanguage({code}))
  }

}
