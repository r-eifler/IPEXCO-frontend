import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunningUserStudyService, UserStudiesService} from '../../../service/user-study-services';
import {Subject} from 'rxjs';
import {UserStudy} from '../../../interface/user-study/user-study';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {USUser} from '../../../interface/user-study/user-study-user';
import {UserStudyUserService} from '../../../service/user-study-user.service';

@Component({
  selector: 'app-user-study-start',
  templateUrl: './user-study-start.component.html',
  styleUrls: ['./user-study-start.component.css']
})
export class UserStudyStartComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  continue = false;
  userRegistered = false;
  error: string = null;

  userStudy: UserStudy;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStudyUserService: UserStudyUserService,
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService
  ) {
  }

  ngOnInit(): void {
    this.userStudyUserService.removeToken(); // TODO only for testing
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initUserStudy() {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: ParamMap) => {
        const userStudyId = params.get('userStudyId');
        this.userStudiesService.getObject(userStudyId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            study => {
              if (study) {
                this.userStudy = study;
                this.selectedUserStudyService.saveObject(study);
              }
            });
      });
  }

  getProlificIDs(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.route.queryParams
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          params => {
            const prolificPID = params.PROLIFIC_PID;
            const studyID = params.STUDY_ID;
            const sessionID = params.SESSION_ID;
            if (prolificPID && studyID) {
              resolve([prolificPID, studyID]);
            } else {
              reject(null);
            }
          }
        );
    });
  }

  userStudyValid() {
    return this.userStudy != null;
  }

  dateValid() {
    if (! this.userStudy) {
      return false;
    }
    const date = new Date();
    const start = new Date(this.userStudy.startDate);
    const end = new Date(this.userStudy.endDate);
    return date > start && date < end;
  }

  onAgree() {
    this.getProlificIDs().then(
      async ids => {
        console.log(ids);
        const prolificUser: USUser = {prolificId: ids[0], userStudyId: ids[1]};

        this.userRegistered = await this.userStudyUserService.register(prolificUser);
        console.log('Registered: ' + this.userRegistered);

        if (this.userRegistered) {
          this.initUserStudy();
        }
      },
      reason => {
        this.error = 'No valid user study link.';
      }
    );
  }

}
