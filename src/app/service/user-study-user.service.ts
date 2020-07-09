import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {USUser} from '../interface/user-study/user-study-user';

@Injectable({
  providedIn: 'root'
})
export class UserStudyUserService {

  tokenName = 'xai-user-study-jwt-token';
  BASE_URL = environment.apiURL + 'user-study-users';

  constructor(
    private http: HttpClient,
  ) {}


  register(user: USUser): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      try {
        this.http.post<{token: string, user: USUser}>(this.BASE_URL, user)
          .subscribe(httpData => {
              console.log(httpData);
              localStorage.setItem(this.tokenName, httpData.token);
              resolve(true);
            },
            (err) => {
              console.log(err);
              reject(null);
            });
      } catch {
        reject();
      }
    });
  }

  loggedIn(): boolean {
    return (localStorage.getItem(this.tokenName) != null);
  }

  removeToken() {
    localStorage.removeItem(this.tokenName);
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http.post<{user: USUser, token: string}>(this.BASE_URL + '/logout', null)
          .subscribe(httpData => {
            localStorage.removeItem(this.tokenName);
            resolve();
          });
      } catch {
        reject();
      }
    });
  }
}
