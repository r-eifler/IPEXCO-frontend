import { Injectable } from '@angular/core';
import {SelectedDomainFileStore} from '../store/stores.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {PDDLFile} from '../_interface/pddlfile';
import {LOAD, REMOVE} from '../store/generic-list.store';


@Injectable({
  providedIn: 'root'
})
export class SelectedDomainFileService {

  constructor(private selectedDomainFileStore: SelectedDomainFileStore) {
    this.selectedDomainFile$ = selectedDomainFileStore.item$;
  }

  selectedDomainFile$: Observable<PDDLFile>;

  findSelectedDomainFile() {
    return this.selectedDomainFile$;
  }

  getSelectedDomainFile(): Observable<PDDLFile> {
    return this.selectedDomainFile$;
  }

  saveDomainFile(domainFile: PDDLFile) {
    this.selectedDomainFileStore.dispatch({type: LOAD, data: domainFile});
  }

  deleteDomainFile(domainFile: PDDLFile) {
    this.selectedDomainFileStore.dispatch({type: REMOVE, data: domainFile});
  }
}
