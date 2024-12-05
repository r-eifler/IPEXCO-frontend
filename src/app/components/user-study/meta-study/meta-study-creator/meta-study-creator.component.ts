import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { UserStudy } from "../../../../interface/user-study/user-study";
import { switchMap, takeUntil } from "rxjs/operators";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MetaStudy } from "src/app/interface/user-study/meta-study";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";

@Component({
  selector: "app-meta-study-creator",
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    FormsModule,
    MatLabel,
    MatFormFieldModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./meta-study-creator.component.html",
  styleUrls: ["./meta-study-creator.component.css"],
})
export class MetaStudyCreatorComponent implements OnInit {

  userStudies$: BehaviorSubject<UserStudy[]>;
  metaForm: UntypedFormGroup;

  metaStudy: MetaStudy;
  numAcceptedUser: Map<string, number> = new Map<string, number>();

  private created = false;

  constructor(
    private route: ActivatedRoute,
    // private userStudiesService: UserStudiesService,
    // private selectedMetaStudyService: SelectedMetaStudyService,
    // private metaStudiesService: MetaStudiesService
  ) {
    // this.route.paramMap
    //   .pipe(
    //     switchMap((params: ParamMap) =>
    //       this.metaStudiesService.getObject(params.get("metaStudyId"))
    //     )
    //   )
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(async (value) => {
    //     if (value != null) {
    //       this.selectedMetaStudyService.saveObject(value);
    //     }
    //   });

    // userStudiesService.findCollection();
    // this.userStudies$ = this.userStudiesService.getList();

    // this.selectedMetaStudyService
    //   .getSelectedObject()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(async (study) => {
    //     if (study) {
    //       this.created = true;
    //       this.metaStudy = study;
    //       for (const s of this.metaStudy.userStudies) {
    //         this.numAcceptedUser.set(
    //           s.userStudy as string,
    //           await this.userStudiesService.getNumberAcceptedUsers(
    //             s.userStudy as string
    //           )
    //         );
    //       }
    //     } else {
    //       this.metaStudy = { name: "", description: "", userStudies: [] };
    //     }
    //   });

    // this.metaForm = new UntypedFormGroup({
    //   name: new UntypedFormControl(),
    //   description: new UntypedFormControl(),
    // });
  }

  ngOnInit(): void {}

  addUserStudy() {
    this.metaStudy.userStudies.push({ userStudy: null, numberTestPersons: 0 });
  }

  delete(s: any) {
    this.metaStudy.userStudies.splice(s, 1);
  }

  save() {
    // this.metaStudiesService.saveObject(this.metaStudy);
  }
}
