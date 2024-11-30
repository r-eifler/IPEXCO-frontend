import { UserStudyDataService } from '../../../../user_study/service/user-study-data.service';
import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {UserStudy} from "../../../../interface/user-study/user-study";
import { USUser } from "../../../../interface/user-study/user-study-user";
import { UserStudyUserService } from "../../../../user_study/service/user-study-user.service";
import { UserStudyData } from 'src/app/interface/user-study/user-study-store';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: "app-accepted-test-persons",
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: "./accepted-test-persons.component.html",
  styleUrls: ["./accepted-test-persons.component.css"],
})
export class AcceptedTestPersonsComponent implements OnInit {
  private ngUnsubscribe$: Subject<any> = new Subject();

  displayedColumns: string[] = [
    "_id",
    "prolificId",
    "finished",
    "createdAt",
    "payment",
    "accepted",
  ];

  dataPoints$ : Observable<UserStudyData[]>;

  constructor(
    private userStudyDataService: UserStudyDataService
  ) {
    this.dataPoints$ = this.userStudyDataService.getList();
  }

  ngOnInit(): void {}

  async updateAccepted(event, dataPoint: UserStudyData) {
    dataPoint.accepted = event;
    await this.userStudyDataService.saveObject(dataPoint);
  }
}
