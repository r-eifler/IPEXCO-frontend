import { UserStudyCurrentDataService, UserStudyDataService } from './../../../../service/user-study/user-study-data.service';
import { USUser } from './../../../../interface/user-study/user-study-user';
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "../../../../service/user-study/user-study-services";
import {
  UserStudy,
  UserStudyStepType,
} from "../../../../interface/user-study/user-study";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { Demo } from "../../../../interface/demo";
import {
  DemosService,
  RunningDemoService,
} from "../../../../service/demo/demo-services";
import { PlanPropertyMapService } from "../../../../service/plan-properties/plan-property-services";
import { UserStudyData } from "src/app/interface/user-study/user-study-store";
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: "app-user-study-data-base",
  templateUrl: "./user-study-data-base.component.html",
  styleUrls: ["./user-study-data-base.component.css"],
})
export class UserStudyDataBaseComponent implements OnInit {


  tabId = 1;

  demos$: Observable<Demo[]>;
  demoIds$: Observable<string[]>;
  selectedDemoId$ = new BehaviorSubject<string>(null);
  selectedDemo$: Observable<Demo>;
  allAcceptedUsers: boolean = false;


  userStudy$: Observable<UserStudy>;
  data$: Observable<UserStudyData[]>;
  allUsers$: Observable<USUser[]>;
  selectedUsers$ = new BehaviorSubject<USUser[]>([]);
  selectedUsers: USUser[];


  constructor(
    private selectedUserStudy: RunningUserStudyService,
    private userStudyDataService: UserStudyDataService,
    public demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
  ) {

    console.log("User study base");
    this.demosService.findCollection();

    this.userStudy$ = this.selectedUserStudy.getSelectedObject()
    .pipe(
      tap(us => console.log(us)),
      takeUntilDestroyed()
      );

    this.data$ = userStudyDataService.getList();

    this.allUsers$ = this.data$.pipe(
      tap(data => console.log("Test")),
      tap(data => console.log(data)),
      takeUntilDestroyed(),
      filter(data => !!data && data.length > 0),
      map(data => data.map(e => e.user))
    );

    this.demoIds$ = this.userStudy$.pipe(
      takeUntilDestroyed(),
      filter(s => !!s),
      map(s => {
        let demoIds = [];
        for (const userStudyStep of s.steps) {
          if (userStudyStep.type === UserStudyStepType.demo) {
           demoIds.push(userStudyStep.content);
          }
        }
        if(demoIds.length > 0)
          this.selectedDemoId$.next(demoIds[0]);
        return demoIds;
      }));

    this.demos$ = combineLatest(([this.demoIds$, this.demosService.getList()])).pipe(
      takeUntilDestroyed(),
      filter(([dids, demos]) => !!dids && !!demos),
      map(([dids, demos]) => demos.filter(d => dids.some(id => id == d._id)))
    )

    this.selectedDemoId$.pipe(
      takeUntilDestroyed(),
      filter(id => !!id)
      ).subscribe(id => {
        this.demosService.getObject(id).pipe(
          filter(d => !!d),
          take(1)
        ).subscribe(demo => {
          this.runningDemoService.saveObject(demo);
          this.currentProjectService.saveObject(demo);
          this.propertiesService.findCollection([{ param: "projectId", value: demo._id }]);
        })
      })
  }

  ngOnInit(): void {
    this.selectAllAccepted();
  }


  userSelectionChanged(): void {
    this.selectedUsers$.next(this.selectedUsers);
  }

  selectDemo(demoId: string) {
    this.selectedDemoId$.next(demoId);
  }

  selectAllAccepted(): void {
    this.allAcceptedUsers = !this.allAcceptedUsers
    if(!this.allAcceptedUsers){
      this.selectedUsers = []
      this.userSelectionChanged()
    }
    else {
      this.data$.pipe(
        takeUntilDestroyed(),
        filter(data => !!data && data.length > 0))
        .subscribe(data => {
          this.selectedUsers = data.filter(d => d.accepted).map(d => d.user);
          this.userSelectionChanged()
        })
    }

  }
}
