import { inject, Injectable } from "@angular/core";
import { ObjectCollectionService } from "../../service/base/object-collection.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { SelectedObjectService } from "../../service/base/selected-object.service";
import { UserStudy } from "../domain/user-study";
import { IHTTPData } from "../../shared/domain/http-data.interface";
import { USUser } from "../domain/user-study-user";
import { UserStudyData } from "src/app/user_study/domain/user-study-store";

@Injectable({
  providedIn: "root",
})
export class UserStudyService{
  
  private http = inject(HttpClient)
  BASE_URL = environment.apiURL + "user-study/";
  

  loadData(id: string): Promise<UserStudyData[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IHTTPData<UserStudyData[]>>(this.BASE_URL + id + "/data")
        .subscribe((res) => {
          resolve(res.data);
        });
    });
  }

  getUsers(id: string): Promise<USUser[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IHTTPData<USUser[]>>(this.BASE_URL + id + "/users")
        .subscribe((res) => {
          resolve(res.data);
        });
    });
  }

  getNumberAcceptedUsers(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IHTTPData<number>>(this.BASE_URL + id + "/num_accepted_users")
        .subscribe((res) => {
          resolve(res.data);
        });
    });
  }
}

