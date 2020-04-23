import { Component, OnInit } from '@angular/core';
import { RunService, CurrentRunService} from '../../../service/run-services';
import { PlanPropertyCollectionService} from '../../../service/plan-property-services';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit {

  constructor(private propertiesService: PlanPropertyCollectionService,
              private runService: RunService,
              private route: ActivatedRoute,
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

}
