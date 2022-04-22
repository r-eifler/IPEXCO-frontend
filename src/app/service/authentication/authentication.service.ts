import { UserStore } from "../../store/stores.store";
import { SelectedObjectService } from "../base/selected-object.service";
import { Injectable } from "@angular/core";
import { User } from "../../interface/user";
import { environment } from "src/environments/environment";
import { IHTTPData } from "../../interface/http-data.interface";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService extends SelectedObjectService<User> {
  BASE_URL = environment.apiURL + "users";

  constructor(private http: HttpClient, store: UserStore) {
    super(store);
  }

  loadUser(): Observable<User> {
    if (this.loggedIn()) {
      this.http.get<IHTTPData<User>>(this.BASE_URL).subscribe((httpData) => {
        this.saveObject(httpData.data);
      });
    }
    return this.selectedObject$;
  }

  register(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http.post<IHTTPData<User>>(this.BASE_URL, user).subscribe(
          (httpData) => {
            resolve();
          },
          (err) => {
            reject();
          }
        );
      } catch {
        reject();
      }
    });
  }

  login(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http
          .post<{ successful: boolean; user: User; token: string }>(
            this.BASE_URL + "/login",
            user
          )
          .subscribe(
            (httpData) => {
              if (httpData.successful) {
                localStorage.setItem("jwt-token", httpData.token);
                this.saveObject(httpData.user);
                resolve();
              } else {
                reject();
              }
            },
            (error) => {
              console.warn(error);
              reject();
            }
          );
      } catch {
        reject();
      }
    });
  }

  getUser(): User {
    return this.selectedObject$.getValue();
  }

  loggedIn(): boolean {
    return localStorage.getItem("jwt-token") != null;
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http
          .post<{ user: User; token: string }>(this.BASE_URL + "/logout", null)
          .subscribe((httpData) => {
            localStorage.removeItem("jwt-token");
            resolve();
          });
      } catch {
        reject();
      }
    });
  }
}
