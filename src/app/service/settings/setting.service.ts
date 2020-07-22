import {ViewSettingsStore} from '../../store/stores.store';
import {defaultViewSettings, ViewSettings} from '../../interface/settings/view-settings';
import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';

@Injectable({
  providedIn: 'root'
})
export class ViewSettingsService extends SelectedObjectService<ViewSettings> {
  constructor(store: ViewSettingsStore) {
    super(store);
    this.saveObject(defaultViewSettings);
  }
}
