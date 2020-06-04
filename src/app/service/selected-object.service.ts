import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PDDLFile} from '../interface/files';
import {LOAD, REMOVE} from '../store/generic-list.store';
import {ItemStore} from '../store/generic-item.store';

@Injectable({
  providedIn: 'root'
})
export class SelectedObjectService<T> {

  selectedObjectStore: ItemStore<T>;

  constructor(selectedObjectStore: ItemStore<T>) {
    this.selectedObjectStore = selectedObjectStore;
    this.selectedObject$ = selectedObjectStore.item$;
  }

  selectedObject$: BehaviorSubject<T>;

  findSelectedObject() {
    return this.selectedObject$;
  }

  getSelectedObject(): BehaviorSubject<T> {
    return this.selectedObject$;
  }

  saveObject(obj: T) {
    this.selectedObjectStore.dispatch({type: LOAD, data: obj});
  }

  deleteObject(obj: T) {
    this.selectedObjectStore.dispatch({type: REMOVE, data: obj});
  }
}
