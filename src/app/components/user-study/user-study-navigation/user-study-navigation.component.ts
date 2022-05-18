import { UserStudyDataService } from './../../../service/user-study/user-study-data.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "../../../service/user-study/user-study-services";
import { UserStudyUserService } from "../../../service/user-study/user-study-user.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-user-study-navigation",
  templateUrl: "./user-study-navigation.component.html",
  styleUrls: ["./user-study-navigation.component.css"],
})
export class UserStudyNavigationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  step = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStudyService: RunningUserStudyService,
    private userStudiesService: UserStudiesService,
    private userStudyDataService: UserStudyDataService
  ) {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.userStudiesService.getObject(params.get("userStudyId"))
        )
      )
      .pipe(filter(us => !!us), takeUntil(this.ngUnsubscribe))
      .subscribe(async (us) => {
          this.userStudyService.saveObject(us);
          console.log("Load data od study: " + us._id);
          this.userStudyDataService.findCollection([{ param: "userStudyId", value: us._id }])
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
