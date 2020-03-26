import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {FileUploadService} from '../../_service/file-upload.service';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';

import {PDDLFile} from '../../_interface/pddlfile';
import {GetDomainFiles} from '../../store/actions/domain-file.actions';
import {Store, select} from '@ngrx/store';
import {AppState} from '../../store/state/app.state';
import {selectDomainFileList} from '../../store/selectors/domain-file.selectors';
import {Router} from '@angular/router';
import {of} from 'rxjs';

@Component({
  selector: 'app-template-file-upload',
  templateUrl: './template-file-upload.component.html',
  styleUrls: ['./template-file-upload.component.css']
})
export class TemplateFileUploadComponent implements OnInit {
  // form fields
  fileForm = new FormGroup({
    name: new FormControl(),
    domain: new FormControl(),
    type: new FormControl(),
    file: new FormControl(),
  });

  // upload indicators
  uploadInProgress = false;
  uploadProgress = 0;

  // uploaded file
  fileToUpload;
  fileObject;

  selectedFiles: PDDLFile[];

  // files observable
  files$ = this.store.pipe(select(selectDomainFileList));


  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  files = [];

  constructor(private store: Store<AppState>, private router: Router, private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetDomainFiles());
  }

  selectFile(event) {
    // TODO
   const selectedFile = this.selectedFiles[0];
   this.router.navigate(['domain_file', selectedFile.id]);
  }

  onSubmit() {
    // build form data
    const formData = new FormData();
    formData.append('pddlfile', this.fileObject);
    formData.append('name', this.fileForm.controls.name.value);
    formData.append('domain', this.fileForm.controls.domain.value);
    formData.append('type', 'domain');

    this.uploadInProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            console.log(event);
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.uploadInProgress = false;
        return of('Upload failed.');
      })).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        console.log(event.body);
      }
    });
  }

  onUploadFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.fileObject = inputNode.files[0];

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.fileToUpload = e.target.result;
      };

      this.fileForm.controls.name.setValue(inputNode.files[0].name);
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }
}
