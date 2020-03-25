import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {FileUploadService} from '../../_service/file-upload.service';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {of} from 'rxjs';

import {PDDLFile} from '../../_interface/pddlfile';
import {GetDomainFiles} from '../../store/actions/domain-file.actions';
import {Store, select} from '@ngrx/store';
import {AppState} from '../../store/state/app.state';
import {selectDomainFileList} from '../../store/selectors/domain-file.selectors';
import {Router} from '@angular/router';

@Component({
  selector: 'app-template-file-upload',
  templateUrl: './template-file-upload.component.html',
  styleUrls: ['./template-file-upload.component.css']
})
export class TemplateFileUploadComponent implements OnInit {


  files$ = this.store.pipe(select(selectDomainFileList));
  @Output() fileSelected  = new EventEmitter();

  /*
  pddlFiles = [
    {name: 'file1', domainType: 'rovers', path: 'test/path/kabfkhsdbf'},
    {name: 'file2', domainType: 'rovers', path: 'test/path/abfasdafasjnfre'}
  ];
  */

  selectedFiles = [];
  @Output() selectedFileChange = new EventEmitter();

  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef; files = [];

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.store.dispatch(new GetDomainFiles());
    // this.files$.subscribe();
  }

  navigateToFile(id: number) {
    this.router.navigate(['file', id]);
  }

  selectFile(event) {
    const file = event[0];
    this.selectedFiles = [file];
    this.selectedFileChange.emit(file);
  }
}
