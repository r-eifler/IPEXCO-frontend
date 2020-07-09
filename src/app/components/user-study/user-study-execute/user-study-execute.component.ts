import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RunningUserStudyService} from '../../../service/user-study/user-study-services';
import {ResponsiveService} from '../../../service/responsive/responsive.service';
import {UserStudy, UserStudyStep, UserStudyStepType} from '../../../interface/user-study/user-study';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-study-executer',
  templateUrl: './user-study-execute.component.html',
  styleUrls: ['./user-study-execute.component.css']
})
export class UserStudyExecuteComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  stepType = UserStudyStepType;

  userStudy: UserStudy;
  currentStep: UserStudyStep;
  currentStepIndex = 0;

  constructor(
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private route: ActivatedRoute) {

    this.selectedUserStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        study => {
          this.userStudy = study;
          this.currentStep = study?.steps[0];
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

  async nextStep() {
    if (this.hasNextStep()) {
      this.currentStep = this.userStudy.steps[++this.currentStepIndex];
    } else {
      await this.router.navigate([''.concat(...['/user-studies/' + this.userStudy._id + '/end'])], { relativeTo: this.route });
    }
  }

  hasNextStep() {
    return this.currentStepIndex < this.userStudy.steps.length - 1;
  }

}
