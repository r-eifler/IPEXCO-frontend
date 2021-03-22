import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserStudiesService} from '../../../../service/user-study/user-study-services';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {UserStudy} from '../../../../interface/user-study/user-study';
import {MetaStudy, UserStudySelection} from '../../../../interface/user-study/meta-study';
import {MetaStudiesService, SelectedMetaStudyService} from '../../../../service/user-study/meta-study-services';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-meta-study-creator',
  templateUrl: './meta-study-creator.component.html',
  styleUrls: ['./meta-study-creator.component.css']
})
export class MetaStudyCreatorComponent implements OnInit, OnDestroy  {

  private ngUnsubscribe: Subject<any> = new Subject();

  userStudies$: BehaviorSubject<UserStudy[]>;
  metaForm: FormGroup;

  metaStudy: MetaStudy;
  numAcceptedUser: Map<string, number> = new Map<string, number>();

  private created = false;

  constructor(
    private route: ActivatedRoute,
    private userStudiesService: UserStudiesService,
    private selectedMetaStudyService: SelectedMetaStudyService,
    private metaStudiesService: MetaStudiesService
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.metaStudiesService.getObject(params.get('metaStudyId')))
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        async value => {
          if (value != null) {
            this.selectedMetaStudyService.saveObject(value);
          }
        }
      );

    userStudiesService.findCollection();
    this.userStudies$ = this.userStudiesService.getList();

    this.selectedMetaStudyService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async study => {
        if (study) {
          this.created = true;
          this.metaStudy = study;
          for (const s of this.metaStudy.userStudies) {
            this.numAcceptedUser.set((s.userStudy as string), await this.userStudiesService.getNumberAcceptedUsers((s.userStudy as string)));
          }
        } else {
          this.metaStudy = {name: '', description: '', userStudies: []};
        }
      });

    this.metaForm = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addUserStudy() {
    this.metaStudy.userStudies.push({userStudy: null, numberTestPersons: 0});
  }

  delete(s: any) {
    this.metaStudy.userStudies.splice(s, 1);
  }

  save() {
   this.metaStudiesService.saveObject(this.metaStudy);
  }
}
