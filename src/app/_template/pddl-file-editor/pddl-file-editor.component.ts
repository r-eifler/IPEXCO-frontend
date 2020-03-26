import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {FileUploadService} from '../../_service/file-upload.service';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {of} from 'rxjs';

@Component({
  selector: 'app-pddl-file-editor',
  templateUrl: './pddl-file-editor.component.html',
  styleUrls: ['./pddl-file-editor.component.css']
})
export class PddlFileEditorComponent implements OnInit {
  fileForm = new FormGroup({
    name: new FormControl(),
    domain: new FormControl(),
    type: new FormControl(),
    file: new FormControl(),
});

  uploadInProgress = false;
  uploadProgress = 0;

  fileToUpload;
  fileObject;

  srcResult;
  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // console.warn(this.fileForm.value);
    // build form data
    const formData = new FormData();
    const enc = new TextDecoder('utf-8');
    formData.append('pddlfile', this.fileObject);
    // formData.append('pddlfile', enc.decode(this.fileToUpload));
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

  onFileSelected() {
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
