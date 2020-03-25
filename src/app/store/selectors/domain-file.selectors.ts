import {createSelector} from '@ngrx/store';

import {AppState} from '../state/app.state';
import {DomainFileState} from '../state/domain-file.state';

const selectDomainFiles = (state: AppState) => state.domainFiles;

export const selectDomainFileList = createSelector(
  selectDomainFiles,
  (state: DomainFileState) => state.files
);

export const selectSelectedDomainFile = createSelector(
  selectDomainFiles,
  (state: DomainFileState) => state.selectedFile
);

