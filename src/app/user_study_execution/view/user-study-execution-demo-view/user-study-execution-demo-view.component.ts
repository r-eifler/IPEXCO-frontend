import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-execution-demo-view',
  standalone: true,
    imports: [
        RouterOutlet
    ],
  templateUrl: './user-study-execution-demo-view.component.html',
  styleUrl: './user-study-execution-demo-view.component.scss'
})
export class UserStudyExecutionDemoViewComponent {

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);

  step$ = this.store.select(selectExecutionUserStudyStep);

  constructor() {
    this.step$.pipe(take(1)).subscribe(step => {
      console.log("Demo in user Study: go to " + ['iterative-planning', step.content])
      this.router.navigate(['iterative-planning', step.content], {relativeTo: this.route});
    })
  }
}
