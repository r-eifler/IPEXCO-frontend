import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study/user-study-services';
import {UserStudy, UserStudyData} from '../../../interface/user-study/user-study';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-data-base',
  templateUrl: './user-study-data-base.component.html',
  styleUrls: ['./user-study-data-base.component.css']
})
export class UserStudyDataBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  userStudy: UserStudy;
  data: UserStudyData[];

  constructor(
    private selectedUserStudy: RunningUserStudyService,
    private userStudiesService: UserStudiesService,
  ) {
    this.selectedUserStudy.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        async v => {
          if (v) {
            this.userStudy = v;
            this.data = await userStudiesService.loadData(this.userStudy._id);
            console.log(this.data);
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
