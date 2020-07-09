import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService} from '../../../service/user-study/user-study-services';
import {UserStudy} from '../../../interface/user-study/user-study';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {UserStudyUserService} from '../../../service/user-study/user-study-user.service';

@Component({
  selector: 'app-user-study-end',
  templateUrl: './user-study-end.component.html',
  styleUrls: ['./user-study-end.component.css']
})
export class UserStudyEndComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  userStudy: UserStudy;

  constructor(
    private userStudyUserService: UserStudyUserService,
    userStudyService: RunningUserStudyService,
    @Inject(DOCUMENT) private document: Document
  ) {
    userStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        s => {
          this.userStudy = s;
        }
      );
  }

  async ngOnInit(): Promise<void> {
    await this.userStudyUserService.logout();
    console.log('Checl logged in: ' + this.userStudyUserService.loggedIn());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  redirectTo() {
    console.log('Redirect to: ' + this.userStudy?.redirectUrl);
    this.document.location.href = this.userStudy?.redirectUrl;
  }
}
