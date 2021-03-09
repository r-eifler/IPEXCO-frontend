import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AuthenticationService} from '../../../../service/authentication/authentication.service';
import {UserStudyUserService} from '../../../../service/user-study/user-study-user.service';
import {UserStudiesService} from '../../../../service/user-study/user-study-services';
import {MetaStudiesService} from '../../../../service/user-study/meta-study-services';
import {MetaStudy} from '../../../../interface/user-study/meta-study';

@Component({
  selector: 'app-study-selection-redirection',
  templateUrl: './study-selection-redirection.component.html',
  styleUrls: ['./study-selection-redirection.component.css']
})
export class StudySelectionRedirectionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  metaStudy: MetaStudy;

  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metaStudiesService: MetaStudiesService,
    private userStudiesService: UserStudiesService
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: ParamMap) => {
        const metaStudyId = params.get('metaStudyId');
        this.metaStudiesService.getObject(metaStudyId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            async study => {
              if (study) {
                this.metaStudy = study;
                await this.selectStudy();
              }
            });
      });
  }

  async selectStudy() {
    const numAcceptedUser: Map<string, number> = new Map<string, number>();
    for (const s of this.metaStudy.userStudies) {
      numAcceptedUser.set(s.userStudy as string, await this.userStudiesService.getNumberAcceptedUsers(s.userStudy as string));
    }

    const possible: string[] = [];
    for (const s of this.metaStudy.userStudies) {
      if (numAcceptedUser.get(s.userStudy as string) < s.numberTestPersons) {
        possible.push(s.userStudy  as string);
      }
    }

    if (possible.length < 1) {
      this.error = true;
      return;
    }

    const selectedVersion = possible[this.getRandomInt(0, possible.length)];

    await this.router.navigate(['../../', selectedVersion, 'run', 'start'], { relativeTo: this.route });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
  }

}
