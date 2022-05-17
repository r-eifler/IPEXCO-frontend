import { Injectable } from "@angular/core";
import { ObjectCollectionService } from "../base/object-collection.service";
import { HttpClient } from "@angular/common/http";
import {
  MetaStudiesStore,
  SelectedMetaStudyStore,
} from "../../store/stores.store";
import { environment } from "../../../environments/environment";
import { SelectedObjectService } from "../base/selected-object.service";
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
