import {ExecutionSettings} from '../../interface/settings/execution-settings';
import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {HttpClient} from '@angular/common/http';
import {ExecutionSettingsStore} from '../../store/stores.store';
import {IHTTPData} from '../../interface/http-data.interface';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSettingsService extends SelectedObjectService<ExecutionSettings> {

  BASE_URL = environment.apiURL + 'settings';

  constructor(
    private http: HttpClient,
    store: ExecutionSettingsStore,
  ) {
    super(store);
  }

  load(settingsId: string): Promise<void> {
    console.log('Executing settings: ' + settingsId);
    return new Promise<void>((resolve, reject) => {
      try {
        this.http.get<IHTTPData<ExecutionSettings>>(this.BASE_URL + '/' + settingsId )
        .subscribe(httpData => {
          console.log(httpData);
          this.saveObject(httpData.data);
          resolve();
          return;
        },
        (err) => {
          // console.log(err);
          reject();
        });
      } catch {
        reject();
      }
    });
  }

  updateSettings(settings: ExecutionSettings) {
    this.http.put<IHTTPData<ExecutionSettings>>(this.BASE_URL + '/' + settings._id, settings )
      .subscribe(httpData => {
          // console.log(httpData);
          super.saveObject(httpData.data);
        });
  }
}
