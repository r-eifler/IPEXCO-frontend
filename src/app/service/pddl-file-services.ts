import {SelectedObjectService} from './selected-object.service';
import {FilesService} from './pddl-files.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  DomainFilesStore,
  DomainSpecificationFilesStore,
  ProblemFilesStore,
  SelectedDomainFileStore,
  SelectedProblemFileStore
} from '../store/stores.store';
import {PDDLFile} from '../interface/files';

@Injectable({
  providedIn: 'root'
})
export class DomainFilesService extends FilesService {

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
export class ProblemFilesService extends FilesService {

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


@Injectable({
  providedIn: 'root'
})
export class DomainSpecificationFilesService extends FilesService {

  type = 'DomainSpecification';

  constructor(http: HttpClient, filesStore: DomainSpecificationFilesStore) {
    super(http, filesStore);
  }
}
