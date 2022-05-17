import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "../../../../service/user-study/user-study-services";
import { takeUntil } from "rxjs/operators";
import {
  UserStudy,
  UserStudyStepType,
} from "../../../../interface/user-study/user-study";
import { Demo } from "../../../../interface/demo";
import { USUser } from "../../../../interface/user-study/user-study-user";
import { SelectionModel } from "@angular/cdk/collections";
import { UserStudyUserService } from "../../../../service/user-study/user-study-user.service";

@Component({
  selector: "app-accepted-test-persons",
  templateUrl: "./accepted-test-persons.component.html",
  styleUrls: ["./accepted-test-persons.component.css"],
})
export class AcceptedTestPersonsComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  private userStudy: UserStudy;

  usUsers: USUser[] = [];

  displayedColumns: string[] = [
    "_id",
    "prolificId",
    "finished",
    "createdAt",
    "payment",
    "accepted",
  ];

  constructor(
    private usUserService: UserStudyUserService,
    private userStudiesService: UserStudiesService,
    private selectedUserStudy: RunningUserStudyService
  ) {
    this.selectedUserStudy
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (v) => {
        if (v) {
          this.userStudy = v;
          this.usUsers = await this.userStudiesService.getUsers(v._id);
        }
      });
  }

  ngOnInit(): void {}

  async updateAccepted(event, usUser: USUser) {
    //TODO
    // usUser.accepted = event;
    // await this.usUserService.update(usUser);
  }
}
