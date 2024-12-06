import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Demo } from '../../../demo/domain/demo';
import { DomSanitizer } from '@angular/platform-browser';
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType,
} from '../../domain/user-study';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import {MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import {ActionCardComponent} from '../../../shared/components/action-card/action-card/action-card.component';
import {AsyncPipe} from '@angular/common';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {PageSectionListComponent} from '../../../shared/components/page/page-section-list/page-section-list.component';
import {PageModule} from '../../../shared/components/page/page.module';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from '@angular/material/datepicker';
import {BreadcrumbModule} from '../../../shared/components/breadcrumb/breadcrumb.module';
import {Store} from '@ngrx/store';
import {selectUserStudyDemos} from '../../state/user-study.selector';

interface Part {
  index: number;
  active: boolean;
  type: UserStudyStepType;
  content?: string;
  url?: string;
  demo?: Demo;
}

@Component({
  selector: 'app-user-study-creator',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    PageModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MarkedPipe,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    RouterLink,
    MatDatepickerModule
  ],
  templateUrl: './user-study-creator.component.html',
  styleUrls: ['./user-study-creator.component.scss'],
})
export class UserStudyCreatorComponent implements OnInit {

  userStudyStepType = UserStudyStepType;
  store = inject(Store)
  fb = inject(FormBuilder);

  demos$ = this.store.select(selectUserStudyDemos)

  userStudy: UserStudy;
  parts: Part[] = [];

  form = this.fb.group({
    name: this.fb.control<string>('', [Validators.required]),
    description: this.fb.control<string>('', [Validators.required]),
    validTimeRange: this.fb.group({
      start: this.fb.control<Date | null>(null, [Validators.required]),
      end: this.fb.control<Date | null>(null, [Validators.required]),
    }),
    redirectUrl: this.fb.control('', []),
  });


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
    //         this.form.disable();
    //       }
    //       this.form.controls.name.setValue(this.userStudy.name);
    //       this.form.controls.description.setValue(
    //         this.userStudy.description
    //       );
    //       this.form.controls.startDate.setValue(
    //         this.userStudy.startDate
    //       );
    //       this.form.controls.endDate.setValue(this.userStudy.endDate);
    //       this.form.controls.redirectUrl.setValue(
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
    //       this.form.enable();
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
    this.form.enable();
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
    this.userStudy.name = this.form.controls.name.value;
    this.userStudy.description = this.form.controls.description.value;
    this.userStudy.startDate = this.form.controls.validTimeRange.controls.start.value;
    this.userStudy.endDate = this.form.controls.validTimeRange.controls.end.value;
    this.userStudy.redirectUrl = this.form.controls.redirectUrl.value;

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

    await this.router.navigate(['/user-studies'], { relativeTo: this.route });
  }
}
