import { DisplayTaskStore } from './../store/stores.store';
import { SelectedObjectService } from './selected-object.service';
import { Injectable } from '@angular/core';
import { DisplayTask } from '../interface/display-task';

@Injectable({
  providedIn: 'root'
})
export class DisplayTaskService extends SelectedObjectService<DisplayTask> {

  constructor(displaTaskStore: DisplayTaskStore) {
    super(displaTaskStore);
  }
}
