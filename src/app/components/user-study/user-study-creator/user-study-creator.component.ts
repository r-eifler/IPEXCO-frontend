import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ResponsiveService} from '../../../service/responsive.service';
import {DemosService} from '../../../service/demo-services';
import {Demo} from '../../../interface/demo';
import {DomSanitizer} from '@angular/platform-browser';
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType
} from '../../../interface/user-study/user-study';
import {FormControl, FormGroup} from '@angular/forms';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

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
  templateUrl: './user-study-creator.component.html',
  styleUrls: ['./user-study-creator.component.css']
})
export class UserStudyCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  userStudyStepType = UserStudyStepType;

  demos$: Observable<Demo[]>;

  userStudy: UserStudy;
  parts: Part[] = [];

  userStudyForm: FormGroup;

  edit = false;

  constructor(
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService,
    private domSanitizer: DomSanitizer,
    private demosService: DemosService,
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    demosService.findCollection();
    this.demos$ = demosService.getList();

    this.userStudyForm = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });

    this.selectedUserStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        study => {
          if (study) {
            this.userStudy = study;
            let index = 0;
            for (const step of this.userStudy.steps) {
              const nextStep: Part = {type: step.type, index: index++, active: false};
              switch (step.type) {
                case UserStudyStepType.description:
                  nextStep.content = step.content;
                  break;
                case UserStudyStepType.form:
                  nextStep.url = step.content;
                  break;
                case UserStudyStepType.demo:
                  demosService.getObject(step.content)
                    .subscribe(d => nextStep.demo = d);
                  break;
              }
              this.parts.push(nextStep);
              this.userStudyForm.disable();
            }
            this.userStudyForm.controls.name.setValue(this.userStudy.name);
            this.userStudyForm.controls.description.setValue(this.userStudy.description);
            this.userStudyForm.controls.startDate.setValue(this.userStudy.startDate);
            this.userStudyForm.controls.endDate.setValue(this.userStudy.endDate);
          } else {
            this.userStudy = new UserStudy('', '', null, null);
            const firstPart: Part = {
              index: 0,
              active: true,
              type: UserStudyStepType.description,
            };
            this.parts.push(firstPart);
            this.edit = true;
            this.userStudyForm.enable();
          }
        });
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( isMobile => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.parts = this.parts.map(p => {p.index = p.index > part.index ? p.index - 1 : p.index; return p; } );
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
    this.parts = this.parts.map(p => {p.active = p.index === index; return p; } );
    event?.stopPropagation();
  }

  deactivateAll() {
    this.parts = this.parts.map(p => {p.active = false; return p; } );
  }

  makeTrustedURL(url: string) {
    const tUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url + '?embedded=true');
    return tUrl;
  }

  saveUserStudy() {
    console.log('Save User Study');
    this.userStudy.name = this.userStudyForm.controls.name.value;
    this.userStudy.description = this.userStudyForm.controls.description.value;
    this.userStudy.startDate = this.userStudyForm.controls.startDate.value;
    this.userStudy.endDate = this.userStudyForm.controls.endDate.value;

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

    this.userStudiesService.saveObject(this.userStudy);

    this.router.navigate(['/user-studies'], { relativeTo: this.route });
  }
}
