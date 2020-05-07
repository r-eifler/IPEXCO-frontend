import { ViewSettingsStore } from './../store/stores.store';
import { ViewSettings, defaultViewSettings } from './../interface/view-settings';
import { Injectable } from '@angular/core';
import { SelectedObjectService } from './selected-object.service';

@Injectable({
  providedIn: 'root'
})
export class ViewSettingsService extends SelectedObjectService<ViewSettings> {
  constructor(store: ViewSettingsStore) {
    super(store);
    this.saveObject(defaultViewSettings);
    console.log('View setting default init');
  }
}
