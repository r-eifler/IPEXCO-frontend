import {Component, inject} from '@angular/core';
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
    ],
    templateUrl: './user-study-execution-start-view.component.html',
    styleUrl: './user-study-execution-start-view.component.scss'
})
export class UserStudyExecutionStartViewComponent {

  store = inject(Store);

  activatedRoute = inject(ActivatedRoute);

  userStudy$ = this.store.select(selectExecutionUserStudy);

  constructor() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe(paramMap => {
      const id = paramMap.get("PROLIFIC_PID");
      if(id !== null){
        this.store.dispatch(executionSaveProlificId({id}));
      }
    })
  }
  
  setLanguage(code: string){
    console.log('Language: ' + code)
    this.store.dispatch(changeLanguage({code}))
  }

}
