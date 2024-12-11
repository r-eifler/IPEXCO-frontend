import { UserStudyDataService } from '../../service/user-study-data.service';
import { USUser } from '../../domain/user-study-user';
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UserStudy,
  UserStudyStepType,
} from "../../domain/user-study";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { Demo } from "../../../demo/domain/demo";
import { UserStudyData } from "src/app/user_study/domain/user-study-execution";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { IndividualRunUserDataComponent } from '../individual-run-user-data/individual-run-user-data.component';
import { TimeLoggerDataComponent } from '../time-logger-data/time-logger-data.component';
import { OverviewDataComponent } from '../overview-data/overview-data.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: "app-user-study-data-base",
  standalone: true,
  imports: [
    AsyncPipe,
    IndividualRunUserDataComponent,
    TimeLoggerDataComponent,
    OverviewDataComponent,
    MatTabsModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatSlideToggleModule,
    MatCardModule,
  ],
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
    // private selectedUserStudy: RunningUserStudyService,
    // private userStudyDataService: UserStudyDataService,
    // // public demosService: DemosService,
    // // private runningDemoService: RunningDemoService,
    // private currentProjectService: CurrentProjectService,
    // private propertiesService: PlanPropertyMapService,
  ) {

    console.log("User study base");
    // this.demosService.findCollection();

    // this.userStudy$ = this.selectedUserStudy.getSelectedObject()
    // .pipe(
    //   tap(us => console.log(us)),
    //   takeUntilDestroyed()
    //   );

    // this.data$ = userStudyDataService.getList();

    // this.allUsers$ = this.data$.pipe(
    //   tap(data => console.log("Test")),
    //   tap(data => console.log(data)),
    //   takeUntilDestroyed(),
    //   filter(data => !!data && data.length > 0),
    //   map(data => data.map(e => e.user))
    // );

    // this.demoIds$ = this.userStudy$.pipe(
    //   takeUntilDestroyed(),
    //   filter(s => !!s),
    //   map(s => {
    //     let demoIds = [];
    //     for (const userStudyStep of s.steps) {
    //       if (userStudyStep.type === UserStudyStepType.demo) {
    //        demoIds.push(userStudyStep.content);
    //       }
    //     }
    //     if(demoIds.length > 0)
    //       this.selectedDemoId$.next(demoIds[0]);
    //     return demoIds;
    //   }));

    // this.demos$ = combineLatest(([this.demoIds$, this.demosService.getList()])).pipe(
    //   takeUntilDestroyed(),
    //   filter(([dids, demos]) => !!dids && !!demos),
    //   map(([dids, demos]) => demos.filter(d => dids.some(id => id == d._id)))
    // )

    // this.selectedDemoId$.pipe(
    //   takeUntilDestroyed(),
    //   filter(id => !!id)
    //   ).subscribe(id => {
    //     this.demosService.getObject(id).pipe(
    //       filter(d => !!d),
    //       take(1)
    //     ).subscribe(demo => {
    //       // this.runningDemoService.saveObject(demo);
    //       this.currentProjectService.saveObject(demo);
    //       this.propertiesService.findCollection([{ param: "projectId", value: demo._id }]);
    //     })
    //   })
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
