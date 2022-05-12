import { ExecutionSettingsStore } from './../../store/stores.store';
import { ExecutionSettings } from 'src/app/interface/settings/execution-settings';
import { SelectedObjectService } from './../base/selected-object.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSettingsServiceService extends SelectedObjectService<ExecutionSettings> {

constructor(store: ExecutionSettingsStore) {
  super(store);
}

}
