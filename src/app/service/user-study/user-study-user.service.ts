import { UserStudyCurrentDataService } from './user-study-data.service';
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { USUser } from "../../interface/user-study/user-study-user";
import { UserStudyData } from 'src/app/interface/user-study/user-study-store';

@Injectable({
  providedIn: "root",
})
export class UserStudyUserService {
  tokenName = "xai-user-study-jwt-token";
  BASE_URL = environment.apiURL + "user-study-users";

  private user = null;

  constructor(
    private http: HttpClient,
    private userStudyCurrentDataService: UserStudyCurrentDataService) {}

  register(user: USUser, userStudyId: string): Promise<boolean> {

    let body = {user, userStudyId}

    return new Promise<boolean>((resolve, reject) => {
      try {
        this.http
          .post<{token: string; user: USUser, metaData: UserStudyData }>(this.BASE_URL, {data: body})
          .subscribe(
            (httpData) => {
              localStorage.setItem(this.tokenName, httpData.token);
              this.user = httpData.user;
              this.userStudyCurrentDataService.saveObject(httpData.metaData);
              resolve(true);
            },
            (err) => {
              reject(null);
            }
          );
      } catch {
        reject();
      }
    });
  }

  loggedIn(): boolean {
    return localStorage.getItem(this.tokenName) != null;
  }

  removeToken() {
    localStorage.removeItem(this.tokenName);
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http
          .post<{ user: USUser; token: string }>(
            this.BASE_URL + "/logout",
            null
          )
          .subscribe((httpData) => {
            localStorage.removeItem(this.tokenName);
            resolve();
          });
      } catch {
        reject();
      }
    });
  }

  update(user: USUser): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.http
          .put(this.BASE_URL + "/" + user._id, { usUser: user })
          .subscribe(
            (httpData) => {
              resolve(true);
            },
            (err) => {
              reject(null);
            }
          );
      } catch {
        reject();
      }
    });
  }

  getLoggedInUser(): USUser {
    return this.user;
  }
}
