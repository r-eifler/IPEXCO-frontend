import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService} from '../../../service/user-study-services';
import {Subject} from 'rxjs';
import {UserStudy} from '../../../interface/user-study/user-study';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-start',
  templateUrl: './user-study-start.component.html',
  styleUrls: ['./user-study-start.component.css']
})
export class UserStudyStartComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  continue = false;

  userStudy: UserStudy;

  constructor(
    userStudyService: RunningUserStudyService
  ) {
    userStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        s => {
          this.userStudy = s;
        }
      );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  dateValid() {
    if (! this.userStudy) {
      return false;
    }
    const date = new Date();
    const start = new Date(this.userStudy.startDate);
    const end = new Date(this.userStudy.endDate);
    return date < start && date < end;
  }

}
