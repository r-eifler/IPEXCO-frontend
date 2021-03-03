import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from '../../../interface/demo';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';
import {RunStatus} from '../../../interface/run';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-demo-info',
  templateUrl: './demo-info.component.html',
  styleUrls: ['./demo-info.component.css']
})
export class DemoInfoComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;
  demo: Demo;
  mugs: string[][];
  planProperties: PlanProperty[];

  constructor(
    private propertiesService: PlanPropertyMapService,
    public dialogRef: MatDialogRef<DemoInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.demo = data.demo;
    this.mugs = data.demo.data?.MUGS;
    this.mugs.sort((a, b) => a.length - b.length);
    this.propertiesService.findCollection([{param: 'projectId', value: this.demo._id}]);
  }

  ngOnInit(): void {
    this.propertiesService.getMap()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        props => {
          const propsList = [...props.values()];
          this.planProperties = propsList.filter((p: PlanProperty) => p.isUsed);
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
