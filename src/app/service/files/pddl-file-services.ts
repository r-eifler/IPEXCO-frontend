import {SelectedObjectService} from '../base/selected-object.service';
import {FilesService} from './pddl-files.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  DomainFilesStore,
  DomainSpecificationFilesStore,
  ProblemFilesStore,
} from '../../store/stores.store';

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
export class ProblemFilesService extends FilesService {

  type = 'problem';

  constructor(http: HttpClient, filesStore: ProblemFilesStore) {
    super(http, filesStore);
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
