import {Action} from '@ngrx/store';

import {PDDLFile} from '../../_interface/pddlfile';

export enum EDomainFileActions {
  GetDomainFiles = '[DomainFile] Get Domain Files',
  GetDomainFilesSuccess = '[DomainFile] Get Domain Files Success',
  GetDomainFile = '[DomainFile] Get Domain File',
  GetDomainFileSuccess = '[DomainFile] Get Domain File Success',
}

export class GetDomainFiles implements Action {
  public readonly type = EDomainFileActions.GetDomainFiles;
}

export class GetDomainFilesSuccess implements Action {
  public readonly type = EDomainFileActions.GetDomainFilesSuccess;
  constructor(public payload: PDDLFile[]) {}
}

export class GetDomainFile implements Action {
  public readonly type = EDomainFileActions.GetDomainFile;
  constructor(public payload: number) {}
}

export class GetDomainFileSuccess implements Action {
  public readonly type = EDomainFileActions.GetDomainFileSuccess;
  constructor(public payload: PDDLFile) {}
}

export type DomainFileActions = GetDomainFile | GetDomainFileSuccess | GetDomainFiles | GetDomainFilesSuccess;
