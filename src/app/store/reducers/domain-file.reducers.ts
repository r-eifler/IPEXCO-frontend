import {DomainFileActions, EDomainFileActions} from '../actions/domain-file.actions';
import {DomainFileState, initialDomainFileState} from '../state/domain-file.state';

export const domainFileReducers = (
  state = initialDomainFileState, action: DomainFileActions
): DomainFileState => {
  switch (action.type) {
    case EDomainFileActions.GetDomainFilesSuccess:{
      return {
        ...state,
        files: action.payload
      };
    }
    case EDomainFileActions.GetDomainFileSuccess: {
      return {
        ...state,
        selectedFile: action.payload
      };
    }

    default:
      return state;
  }
};
