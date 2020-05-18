import { Component, OnInit } from '@angular/core';
import { RunService, CurrentRunService} from '../../../service/run-services';
import { PlanPropertyCollectionService} from '../../../service/plan-property-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: PlanPropertyCollectionService,
    private runService: RunService,
    currentRunService: CurrentRunService) {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.runService.getObject(params.get('runid')))
    ).subscribe(value => {
      currentRunService.saveObject(value);
    });
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
  }

  newQuestion() {
    this.router.navigate(['./new-question'], { relativeTo: this.route });
  }
}
