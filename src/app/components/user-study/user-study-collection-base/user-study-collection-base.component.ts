import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study/user-study-services';
import {ResponsiveService} from '../../../service/responsive/responsive.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-collection-base',
  templateUrl: './user-study-collection-base.component.html',
  styleUrls: ['./user-study-collection-base.component.css']
})
export class UserStudyCollectionBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  public showTab = 2;

  constructor(
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
  ) {

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
