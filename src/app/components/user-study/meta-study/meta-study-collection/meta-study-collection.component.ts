import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetaStudiesService, SelectedMetaStudyService} from '../../../../service/user-study/meta-study-services';
import {Observable} from 'rxjs';
import {UserStudy} from '../../../../interface/user-study/user-study';
import {MetaStudy} from '../../../../interface/user-study/meta-study';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-meta-study-collection',
  templateUrl: './meta-study-collection.component.html',
  styleUrls: ['./meta-study-collection.component.css']
})
export class MetaStudyCollectionComponent implements OnInit {

  metaStudies$: Observable<MetaStudy[]>;

  urlBase = environment.localURL + '/user-studies/selection';

  constructor(
    private metaStudyService: MetaStudiesService,
    private selectedMetaStudyService: SelectedMetaStudyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.metaStudyService.findCollection();
    this.metaStudies$ = metaStudyService.getList();
  }

  ngOnInit(): void {
  }

  async openMetaStudy(s: MetaStudy) {
    await this.router.navigate(['./meta-study', s._id], { relativeTo: this.route });
  }

  async newMetaStudy() {
    await this.router.navigate(['./meta-study'], { relativeTo: this.route });
  }

  getStudyLink(study: MetaStudy) {
    return this.urlBase + '/' + study._id;
  }

  deleteMetaStudy(s: MetaStudy) {
    this.metaStudyService.deleteObject(s);
  }
}
