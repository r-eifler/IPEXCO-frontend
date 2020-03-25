import {Injectable} from '@angular/core';
import {Effect, ofType, Actions} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import { of } from 'rxjs';
import {switchMap, map, withLatestFrom} from 'rxjs/operators';

import {AppState} from '../state/app.state';
import {GetDomainFilesSuccess,
  GetDomainFileSuccess,
  GetDomainFiles,
  GetDomainFile,
  EDomainFileActions} from '../actions/domain-file.actions';

import { DomainFileService} from '../../_service/domain-file.service';
import {IPDDLFileHttp} from '../../_interface/http-models/pddlfile-http.interface';
import {selectDomainFileList} from '../selectors/domain-file.selectors';

@Injectable()
export class DomainFileEffects {

  @Effect()
  getDomainFile$ = this.actions$.pipe(
    ofType<GetDomainFile>(EDomainFileActions.GetDomainFile),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(selectDomainFileList))),
    switchMap(([id, files]) => {
      const selectedDomainFile = files.filter(file => true)[0];
      return of(new GetDomainFileSuccess(selectedDomainFile));
    })
  );

  @Effect()
  getDomainFiles$ = this.actions$.pipe(
    ofType<GetDomainFiles>(EDomainFileActions.GetDomainFiles),
    switchMap(() => this.domainFileService.getDomainFiles()),
    switchMap((fileHttp: IPDDLFileHttp) => of(new GetDomainFilesSuccess(fileHttp.data)))
  );


constructor(
  private domainFileService: DomainFileService,
  private actions$: Actions,
  private store: Store<AppState>
) {}

}
