import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study-services';
import {ResponsiveService} from '../../../service/responsive.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-base',
  templateUrl: './user-study-base.component.html',
  styleUrls: ['./user-study-base.component.css']
})
export class UserStudyBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  constructor(
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: ParamMap) => {
        const userStudyId = params.get('userStudyId');
        this.userStudiesService.getObject(userStudyId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            study => {
              if (study) {
                this.selectedUserStudyService.saveObject(study);
              }
            });
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

}
