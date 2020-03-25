import {PDDLFile} from '../../_interface/pddlfile';

export interface DomainFileState {
  files: PDDLFile[];
  selectedFile: PDDLFile;
}

export const initialDomainFileState: DomainFileState = {
  files: null,
  selectedFile: null,
};
