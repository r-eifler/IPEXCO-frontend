import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {DomainFilesService} from '../../_service/domain-files.service';
import {SelectedDomainFileService} from '../../_service/selected-domain-file.service';

import {PDDLFile} from '../../_interface/pddlfile';
import {Observable} from 'rxjs';

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

  // uploaded file
  fileToUpload;
  fileObject;

  // files observable
  files$: Observable<PDDLFile[]>;
  selectedFiles: PDDLFile[];


  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;

  constructor(private selectedFileService: SelectedDomainFileService,
              private fileService: DomainFilesService) {
  }

  ngOnInit(): void {
    this.files$ = this.fileService.domainFiles$;
    this.fileService.findDomainFiles().subscribe();
  }

  selectFile(event) {
   const selectedFile = this.selectedFiles[0];
   this.selectedFileService.saveDomainFile(selectedFile);
  }

  onSubmit() {
    const uploadFile: PDDLFile = {
      _id: null,
      path: '',
      name: this.fileForm.controls.name.value,
      type: 'domain',
      domain: this.fileForm.controls.domain.value,
      data: this.fileObject
    };

    this.fileService.saveDomainFile(uploadFile);
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

  deleteFile(file: PDDLFile) {
    console.log(file);
    this.fileService.deleteDomainFile(file);
  }
}
