import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study/user-study-services';
import {UserStudyUserService} from '../../../service/user-study/user-study-user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-user-study-navigation',
  templateUrl: './user-study-navigation.component.html',
  styleUrls: ['./user-study-navigation.component.css']
})
export class UserStudyNavigationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  step = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStudyService: RunningUserStudyService,
    private userStudiesService: UserStudiesService
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userStudiesService.getObject(params.get('userStudyId')))
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      async value => {
        if (value != null) {
          this.userStudyService.saveObject(value);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
