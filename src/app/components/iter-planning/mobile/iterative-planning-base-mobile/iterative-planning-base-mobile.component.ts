import {takeUntil} from 'rxjs/operators';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from 'src/app/interface/project';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-iterative-planning-base-mobile',
  templateUrl: './iterative-planning-base-mobile.component.html',
  styleUrls: ['./iterative-planning-base-mobile.component.css']
})
export class IterativePlanningBaseMobileComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  private project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectService: CurrentProjectService,
    private runService: IterationStepsService,
  ) {


    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      if (value !== null) {
        this.project = value;
        this.runService.findCollection([{param: 'projectId', value: this.project._id}]);
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  newPlanRun() {
    this.router.navigate(['../new-planning-step'], { relativeTo: this.route });
  }

}
