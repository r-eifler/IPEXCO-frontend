import { ObjectCollectionService } from './../base/object-collection.service';
import {PlanningTaskRelaxationsStore, PlanPropertyMapStore} from '../../store/stores.store';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlanProperty} from '../../interface/plan-property/plan-property';
import {environment} from '../../../environments/environment';
import {ObjectMapService} from '../base/object-map.service';
import { PlanningTaskRelaxationSpace } from 'src/app/interface/planning-task-relaxation';


@Injectable({
  providedIn: 'root'
})
export class PlanningTaskRelaxationService extends ObjectCollectionService<PlanningTaskRelaxationSpace> {

  constructor(http: HttpClient, store: PlanningTaskRelaxationsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planning-task-relaxation/';
  }
}
