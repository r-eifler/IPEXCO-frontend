import {SelectedObjectService} from './selected-object.service';
import {PddlFilesService} from './pddl-files.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomainFilesStore, ProblemFilesStore, SelectedDomainFileStore, SelectedProblemFileStore} from '../store/stores.store';
import {PDDLFile} from '../interface/pddlfile';

@Injectable({
  providedIn: 'root'
})
export class DomainFilesService extends PddlFilesService {

  type = 'domain';

  constructor(http: HttpClient, filesStore: DomainFilesStore) {
    super(http, filesStore);
  }
}


@Injectable({
  providedIn: 'root'
})
export class SelectedDomainFileService extends SelectedObjectService<PDDLFile> {

  type = 'domain';

  constructor(selectedFilesStore: SelectedDomainFileStore) {
    super(selectedFilesStore);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProblemFilesService extends PddlFilesService {

  type = 'problem';

  constructor(http: HttpClient, filesStore: ProblemFilesStore) {
    super(http, filesStore);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SelectedProblemFileService extends SelectedObjectService<PDDLFile> {

  type = 'problem';

  constructor(selectedFilesStore: SelectedProblemFileStore) {
    super(selectedFilesStore);
  }
}
