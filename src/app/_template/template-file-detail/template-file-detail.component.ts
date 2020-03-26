import {Component, OnInit, OnDestroy} from '@angular/core';

import {PDDLFile} from '../../_interface/pddlfile';
import {GetDomainFile} from '../../store/actions/domain-file.actions';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/state/app.state';
import {selectDomainFileList, selectSelectedDomainFile} from '../../store/selectors/domain-file.selectors';
import {Router} from '@angular/router';

@Component({
  selector: 'app-template-file-detail',
  templateUrl: './template-file-detail.component.html',
  styleUrls: ['./template-file-detail.component.css']
})
export class TemplateFileDetailComponent implements OnInit, OnDestroy {

  editorOptions = {theme: 'vs-light', language: 'javascript'};
  code = 'test';

  // files observable
  file$ = this.store.pipe(select(selectSelectedDomainFile));
  fileSubscribtion;

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.fileSubscribtion = this.file$.subscribe();
  }

  ngOnDestroy(): void {
    this.fileSubscribtion.unsubscribe();
  }

  // @Input() set file(newFile: any) {
  //   this._file = newFile;
  //   this.code = newFile.name;
  // }
}
