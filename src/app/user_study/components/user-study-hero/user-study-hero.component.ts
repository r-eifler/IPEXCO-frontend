import {Component, input} from '@angular/core';
import {DemoStatusColorPipe} from '../../../project/pipe/demo-status-color.pipe';
import {DemoStatusNamePipe} from '../../../project/pipe/demo-status-name.pipe';
import {LabelComponent} from '../../../shared/components/label/label/label.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {UserStudy} from '../../domain/user-study';
import {DatePipe} from '@angular/common';
import {UserStudyStatusNamePipe} from '../../pipes/user-study-status-name.pipe';
import {UserStudyStatusColorPipe} from '../../pipes/user-study-status-color.pipe';
import {UserStudyExecution} from '../../domain/user-study-execution';

@Component({
  selector: 'app-user-study-hero',
  standalone: true,
  imports: [
    UserStudyStatusNamePipe,
    UserStudyStatusColorPipe,
    LabelComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    DatePipe
  ],
  templateUrl: './user-study-hero.component.html',
  styleUrl: './user-study-hero.component.scss'
})
export class UserStudyHeroComponent {

  userStudy = input.required<UserStudy>();
  participants = input.required<UserStudyExecution[]>();
}
