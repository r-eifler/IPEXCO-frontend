import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { selectExecutionUserStudyStep } from '../../state/user-study-execution.selector';
import { UserStudyStepType } from 'src/app/user_study/domain/user-study';

@Component({
  selector: 'app-project-view',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent {

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  step$ = this.store.select(selectExecutionUserStudyStep);

  constructor() {
    this.step$.pipe(take(1)).subscribe(step => {
      console.log("Project in user Study: go to " + ['beluga-planning', step?.content])
      if(step?.content && step.type == UserStudyStepType.project)
        this.router.navigate(['beluga-planning', step.content], {relativeTo: this.route});
    })
  }

}
