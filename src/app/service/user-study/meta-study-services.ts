import { Injectable } from "@angular/core";
import { ObjectCollectionService } from "../base/object-collection.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  MetaStudiesStore,
  RunningUserStudyStore,
  SelectedMetaStudyStore,
  UserStudiesStore,
} from "../../store/stores.store";
import { environment } from "../../../environments/environment";
import { SelectedObjectService } from "../base/selected-object.service";
import {
  UserStudy,
  UserStudyData,
} from "../../interface/user-study/user-study";
import { IHTTPData } from "../../interface/http-data.interface";
import { LOAD } from "../../store/generic-list.store";
import { MetaStudy } from "../../interface/user-study/meta-study";

@Injectable({
  providedIn: "root",
})
export class MetaStudiesService extends ObjectCollectionService<MetaStudy> {
  constructor(http: HttpClient, store: MetaStudiesStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + "meta-study/";
  }
}

@Injectable({
  providedIn: "root",
})
export class SelectedMetaStudyService extends SelectedObjectService<MetaStudy> {
  constructor(store: SelectedMetaStudyStore) {
    super(store);
  }
}
