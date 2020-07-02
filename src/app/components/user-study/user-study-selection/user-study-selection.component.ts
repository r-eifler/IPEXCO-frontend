import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ResponsiveService} from '../../../service/responsive.service';
import {takeUntil} from 'rxjs/operators';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study-services';
import {UserStudy} from '../../../interface/user-study/user-study';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-study-selection',
  templateUrl: './user-study-selection.component.html',
  styleUrls: ['./user-study-selection.component.css']
})
export class UserStudySelectionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  userStudies$: Observable<UserStudy[]>;

  constructor(
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
    private router: Router) {
    userStudiesService.findCollection();
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( isMobile => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();

    this.userStudies$ = this.userStudiesService.getList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openInfo(study: UserStudy) {
    // this.selectedUserStudyService.saveObject(study);
    this.router.navigate(['../user-studies/' + study._id + '/info'], { relativeTo: this.route });
  }

  delete(study: UserStudy) {
    this.userStudiesService.deleteObject(study);
  }

}
