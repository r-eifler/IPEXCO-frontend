import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RunningUserStudyService} from '../../../service/user-study-services';
import {ResponsiveService} from '../../../service/responsive.service';
import {UserStudy, UserStudyStep, UserStudyStepType} from '../../../interface/user-study/user-study';

@Component({
  selector: 'app-user-study-executer',
  templateUrl: './user-study-executer.component.html',
  styleUrls: ['./user-study-executer.component.css']
})
export class UserStudyExecuterComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  stepType = UserStudyStepType;

  userStudy: UserStudy;
  currentStep: UserStudyStep;
  currentStepIndex = 0;

  constructor(
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService) {

    this.selectedUserStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        study => {
          this.userStudy = study;
          this.currentStep = study?.steps[0];
          console.log(this.currentStep);
        }
      );
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

  nextStep() {
    this.currentStep = this.userStudy.steps[++this.currentStepIndex];
  }

}
