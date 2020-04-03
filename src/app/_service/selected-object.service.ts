import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {PDDLFile} from '../_interface/pddlfile';
import {LOAD, REMOVE} from '../store/generic-list.store';
import {ItemStore} from '../store/generic-item.store';

@Injectable({
  providedIn: 'root'
})
export class SelectedObjectService {

  constructor(private selectedObjectStore: ItemStore<PDDLFile>) {
    this.selectedObject$ = selectedObjectStore.item$;
  }

  selectedObject$: Observable<PDDLFile>;

  findSelectedObject() {
    return this.selectedObject$;
  }

  getSelectedObject(): Observable<PDDLFile> {
    return this.selectedObject$;
  }

  saveObject(domainFile: PDDLFile) {
    this.selectedObjectStore.dispatch({type: LOAD, data: domainFile});
  }

  deleteDomainFile(domainFile: PDDLFile) {
    this.selectedObjectStore.dispatch({type: REMOVE, data: domainFile});
  }
}
