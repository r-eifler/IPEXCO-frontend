import { PlanPropertyCollectionStore } from './../store/stores.store';
import { ObjectCollectionService } from './object-collection.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanProperty } from '../interface/plan-property';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { GoalType } from '../interface/goal';


@Injectable({
  providedIn: 'root'
})
export class PlanPropertyCollectionService extends ObjectCollectionService<PlanProperty> {
  constructor(http: HttpClient, store: PlanPropertyCollectionStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'plan-property/';
    this.pipeGet = map((value: PlanProperty): PlanProperty => { value.goalType = GoalType.planProperty; return value; });
    this.pipeFind = map((value: PlanProperty[]): PlanProperty[] => {
      for (const p of value) {
        p.goalType = GoalType.planProperty;
      }
      return value;
    });
  }
}
