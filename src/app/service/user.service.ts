import {UserStore} from './../store/stores.store';
import {SelectedObjectService} from './selected-object.service';
import {Injectable} from '@angular/core';
import {User} from '../interface/user';
import {environment} from 'src/environments/environment';
import {IHTTPData} from '../interface/http-data.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends SelectedObjectService<User> {

  BASE_URL = environment.apiURL + 'users';

  constructor(
    private http: HttpClient,
    store: UserStore,
  ) {
    super(store);
  }


  loadUser(): Observable<User> {
    if (this.loggedIn()) {
      this.http.get<IHTTPData<User>>(this.BASE_URL)
        .subscribe(httpData => {
          this.saveObject(httpData.data);
        });
    }
    return this.selectedObject$;
  }

  register(user: User): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      try {
        this.http.post<IHTTPData<User>>(this.BASE_URL, user)
        .subscribe(httpData => {
          console.log(httpData);
          if (httpData.status === 201) {
            this.saveObject(httpData.data);
            resolve();
            return;
          }
          reject();
        },
        (err) => {
          console.log('ERROR register: ');
          console.log(err);
          reject();
        });
      } catch {
        reject();
      }
    });
  }

  login(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log('Login...');
        this.http.post<{user: User, token: string}>(this.BASE_URL + '/login', user)
        .subscribe(httpData => {
          localStorage.setItem('jwt-token', httpData.token);
          this.saveObject(httpData.user);
          resolve();
        });
      } catch {
        reject();
      }
    });
  }

  getUser(): User {
    return this.selectedObject$.getValue();
  }

  loggedIn(): boolean {
    return (localStorage.getItem('jwt-token') != null);
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.http.post<{user: User, token: string}>(this.BASE_URL + '/logout', null)
        .subscribe(httpData => {
          localStorage.removeItem('jwt-token');
          resolve();
        });
      } catch {
        reject();
      }
    });
  }
}


