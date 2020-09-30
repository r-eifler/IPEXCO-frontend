import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService, UserStudiesService} from '../../../../service/user-study/user-study-services';
import {UserStudy, UserStudyData, UserStudyStepType} from '../../../../interface/user-study/user-study';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Demo} from '../../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../../service/demo/demo-services';
import {ExecutionSettingsService} from '../../../../service/settings/execution-settings.service';
import {PlanPropertyMapService} from '../../../../service/plan-properties/plan-property-services';

@Component({
  selector: 'app-user-study-data-base',
  templateUrl: './user-study-data-base.component.html',
  styleUrls: ['./user-study-data-base.component.css']
})
export class UserStudyDataBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  selectedDemoId: string;
  tabId = 1;
  selectedDataEntries: UserStudyData[] = [];

  userStudy: UserStudy;
  data: UserStudyData[] = [];

  demoIds: string[];
  selectedDemo: Demo;

  constructor(
    private selectedUserStudy: RunningUserStudyService,
    private userStudiesService: UserStudiesService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private settingsService: ExecutionSettingsService,
    private propertiesService: PlanPropertyMapService,
  ) {
    this.selectedUserStudy.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        async v => {
          if (v) {
            this.userStudy = v;
            this.demoIds = [];
            for (const userStudyStep of this.userStudy.steps) {
              if (userStudyStep.type === UserStudyStepType.demo) {
                this.demoIds.push(userStudyStep.content);
              }
            }
            this.selectDemo(this.demoIds[0]);
            this.data = await userStudiesService.loadData(this.userStudy._id);
            console.log(this.data);
          }
        }
      );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectDemo(demoId: string) {
    this.selectedDemoId = demoId;
    this.demosService.getObject(demoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (demo: Demo) => {
          if (demo) {
            this.selectedDemo = demo;
            this.runningDemoService.saveObject(demo);
            this.propertiesService.findCollection([{param: 'projectId', value: demo._id}]);
          }
        }
      );
  }


}
