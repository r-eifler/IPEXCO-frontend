import {Component, inject, input} from '@angular/core';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {UserStudy} from '../../domain/user-study';
import {DatePipe} from '@angular/common';
import {UserStudyExecution} from '../../domain/user-study-execution';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-study-card',
    imports: [
        MatAnchor,
        MatCardModule,
        MatIcon,
        MatIconButton,
        MatTooltip,
        DatePipe
    ],
    templateUrl: './user-study-card.component.html',
    styleUrl: './user-study-card.component.scss'
})
export class UserStudyCardComponent {

  router = inject(Router);

  userStudy = input.required<UserStudy>();
  participants = input.required<UserStudyExecution[]>()

  onRun(){
    this.router.navigate(['user-study-execution', this.userStudy()._id]);
  }

  onDetails(){
    this.router.navigate(['user-study', this.userStudy()._id, 'details']);
  }

}
