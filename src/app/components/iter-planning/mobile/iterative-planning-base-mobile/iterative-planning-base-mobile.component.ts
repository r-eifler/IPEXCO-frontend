import { Component, OnInit } from '@angular/core';
import { CurrentProjectStore } from 'src/app/store/stores.store';
import { RunService } from 'src/app/service/run-services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-iterative-planning-base-mobile',
  templateUrl: './iterative-planning-base-mobile.component.html',
  styleUrls: ['./iterative-planning-base-mobile.component.css']
})
export class IterativePlanningBaseMobileComponent implements OnInit {

  private project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectStore: CurrentProjectStore,
    private runService: RunService,
  ) {


    this.currentProjectStore.item$.subscribe(value => {
      if (value !== null) {
        this.project = value;
        this.runService.findCollection([{param: 'projectId', value: this.project._id}]);
      }
    });
  }

  ngOnInit(): void {
  }

  newPlanRun() {
    this.router.navigate(['../new-planning-step'], { relativeTo: this.route });
  }

}
