import { UserStudyDataService } from '../../service/user-study-data.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserStudyUserService } from "../../service/user-study-user.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AcceptedTestPersonsComponent } from '../../eval/accepted-test-persons/accepted-test-persons.component';
import { UserStudyDataBaseComponent } from '../../eval/user-study-data-base/user-study-data-base.component';
import { UserStudyCreatorComponent } from '../user-study-creator/user-study-creator.component';
import { MatTabLink } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-user-study-navigation",
  standalone: true,
  imports: [
    AcceptedTestPersonsComponent,
    UserStudyDataBaseComponent,
    UserStudyCreatorComponent,
    MatTabLink,
    FormsModule,
  ],
  templateUrl: "./user-study-navigation.component.html",
  styleUrls: ["./user-study-navigation.component.css"],
})
export class UserStudyNavigationComponent implements OnInit {

  step = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // this.route.paramMap
    //   .pipe(
    //     switchMap((params: ParamMap) =>
    //       this.userStudiesService.getObject(params.get("userStudyId"))
    //     )
    //   )
    //   .pipe(filter(us => !!us), takeUntilDestroyed())
    //   .subscribe(async (us) => {
    //       this.userStudyService.saveObject(us);
    //       console.log("Load data od study: " + us._id);
    //       this.userStudyDataService.findCollection([{ param: "userStudyId", value: us._id }])
    //   });
  }

  ngOnInit(): void {}

}
