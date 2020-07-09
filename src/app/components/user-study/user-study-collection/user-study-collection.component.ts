import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ResponsiveService} from '../../../service/responsive/responsive.service';
import {takeUntil} from 'rxjs/operators';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study/user-study-services';
import {UserStudy} from '../../../interface/user-study/user-study';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-user-study-selection',
  templateUrl: './user-study-collection.component.html',
  styleUrls: ['./user-study-collection.component.css']
})
export class UserStudyCollectionComponent implements OnInit, OnDestroy {

  urlBase = environment.localURL + '/user-studies';
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

  async openInfo(study: UserStudy) {
    this.selectedUserStudyService.saveObject(study);
    await this.router.navigate(['../user-studies/' + study._id + '/info'], { relativeTo: this.route });
  }

  async newUserStudy() {
    this.selectedUserStudyService.saveObject(null);
    await this.router.navigate(['./new-user-study'], { relativeTo: this.route });
  }

  delete(study: UserStudy) {
    this.userStudiesService.deleteObject(study);
  }

  getStudyLink(study: UserStudy) {
    return this.urlBase + '/' + study._id + '/start';
  }

}
