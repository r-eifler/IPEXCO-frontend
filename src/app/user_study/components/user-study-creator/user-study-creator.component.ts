import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Demo } from "../../../demo/domain/demo";
import { DomSanitizer } from "@angular/platform-browser";
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType,
} from "../../domain/user-study";
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MarkedPipe } from "src/app/pipes/marked.pipe";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";

interface Part {
  index: number;
  active: boolean;
  type: UserStudyStepType;
  content?: string;
  url?: string;
  demo?: Demo;
}

@Component({
  selector: "app-user-study-creator",
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MarkedPipe,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: "./user-study-creator.component.html",
  styleUrls: ["./user-study-creator.component.css"],
})
export class UserStudyCreatorComponent implements OnInit {
  isMobile: boolean;

  userStudyStepType = UserStudyStepType;

  demos$: Observable<Demo[]>;

  userStudy: UserStudy;
  parts: Part[] = [];

  userStudyForm: UntypedFormGroup;

  edit = false;

  constructor(
    // private userStudiesService: UserStudiesService,
    // private selectedUserStudyService: RunningUserStudyService,
    // private domSanitizer: DomSanitizer,
    // // private demosService: DemosService,
    // private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // demosService.findCollection();
    // this.demos$ = demosService.getList();

    this.userStudyForm = new UntypedFormGroup({
      name: new UntypedFormControl(),
      description: new UntypedFormControl(),
      startDate: new UntypedFormControl(),
      endDate: new UntypedFormControl(),
      redirectUrl: new UntypedFormControl(),
    });

    // this.selectedUserStudyService
    //   .getSelectedObject()
    //   .pipe(
    //     takeUntilDestroyed())
    //   .subscribe((study) => {
    //     if (study) {
    //       this.userStudy = study;
    //       let index = 0;
    //       for (const step of this.userStudy.steps) {
    //         const nextStep: Part = {
    //           type: step.type,
    //           index: index++,
    //           active: false,
    //         };
    //         switch (step.type) {
    //           case UserStudyStepType.description:
    //             nextStep.content = step.content;
    //             break;
    //           case UserStudyStepType.form:
    //             nextStep.url = step.content;
    //             break;
    //           case UserStudyStepType.demo:
    //             // demosService
    //             //   .getObject(step.content)
    //             //   .subscribe((d) => (nextStep.demo = d));
    //             break;
    //         }
    //         this.parts.push(nextStep);
    //         this.userStudyForm.disable();
    //       }
    //       this.userStudyForm.controls.name.setValue(this.userStudy.name);
    //       this.userStudyForm.controls.description.setValue(
    //         this.userStudy.description
    //       );
    //       this.userStudyForm.controls.startDate.setValue(
    //         this.userStudy.startDate
    //       );
    //       this.userStudyForm.controls.endDate.setValue(this.userStudy.endDate);
    //       this.userStudyForm.controls.redirectUrl.setValue(
    //         this.userStudy.redirectUrl
    //       );
    //     } else {
    //       this.userStudy = {
    //         updated: new Date().toLocaleString(),
    //         name: "",
    //         description: "",
    //         user: null,
    //         available: false,
    //         redirectUrl: "",
    //       };
    //       const firstPart: Part = {
    //         index: 0,
    //         active: true,
    //         type: UserStudyStepType.description,
    //       };
    //       this.parts.push(firstPart);
    //       this.edit = true;
    //       this.userStudyForm.enable();
    //     }
    //   });
  }

  ngOnInit(): void {
    // this.responsiveService
    //   .getMobileStatus()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((isMobile) => {
    //     this.isMobile = isMobile;
    //   });
    // this.responsiveService.checkWidth();
  }

  editUserStudy() {
    this.edit = true;
    this.userStudyForm.enable();
  }

  addNewPart() {
    const newPart: Part = {
      index: this.parts.length,
      active: true,
      type: UserStudyStepType.description,
    };

    this.parts.push(newPart);

    this.activate(null, newPart.index);
  }

  deletePart(part: Part) {
    this.parts = this.parts.map((p) => {
      p.index = p.index > part.index ? p.index - 1 : p.index;
      return p;
    });
    this.parts.splice(part.index, 1);
  }

  moveUp(part: Part) {
    const switchPart = this.parts[part.index - 1];
    switchPart.index++;
    part.index--;
    this.parts[switchPart.index] = switchPart;
    this.parts[part.index] = part;
  }

  moveDown(part: Part) {
    const switchPart = this.parts[part.index + 1];
    switchPart.index--;
    part.index++;
    this.parts[switchPart.index] = switchPart;
    this.parts[part.index] = part;
  }

  activate(event, index: number) {
    if (!this.edit) {
      return;
    }
    this.parts = this.parts.map((p) => {
      p.active = p.index === index;
      return p;
    });
    event?.stopPropagation();
  }

  deactivateAll() {
    this.parts = this.parts.map((p) => {
      p.active = false;
      return p;
    });
  }

  makeTrustedURL(url: string) {
    // return this.domSanitizer.bypassSecurityTrustResourceUrl(
    //   url + "?embedded=true"
    // );
  }

  async saveUserStudy() {
    this.userStudy.name = this.userStudyForm.controls.name.value;
    this.userStudy.description = this.userStudyForm.controls.description.value;
    this.userStudy.startDate = this.userStudyForm.controls.startDate.value;
    this.userStudy.endDate = this.userStudyForm.controls.endDate.value;
    this.userStudy.redirectUrl = this.userStudyForm.controls.redirectUrl.value;

    this.userStudy.steps = [];
    for (const part of this.parts) {
      const nextStep: UserStudyStep = {type: part.type, content: null};
      switch (part.type) {
        case UserStudyStepType.description:
          nextStep.content = part.content;
          break;
        case UserStudyStepType.form:
          nextStep.content = part.url;
          break;
        case UserStudyStepType.demo:
          nextStep.content = part.demo._id;
          break;
      }
    this.userStudy.steps.push(nextStep);
    }

    // this.userStudiesService.saveObject(this.userStudy);

    await this.router.navigate(["/user-studies"], { relativeTo: this.route });
  }
}
