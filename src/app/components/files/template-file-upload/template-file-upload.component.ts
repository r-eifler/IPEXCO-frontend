import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {PddlFilesService} from '../../../service/pddl-files.service';
import {SelectedObjectService} from '../../../service/selected-object.service';

import {PDDLFile} from '../../../interface/pddlfile';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-template-file-upload',
  templateUrl: './template-file-upload.component.html',
  styleUrls: ['./template-file-upload.component.css']
})
export class TemplateFileUploadComponent implements OnInit {

  @Input() type;

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


  constructor(private selectedFileService: SelectedObjectService<PDDLFile>,
              private fileService: PddlFilesService) {
  }

  ngOnInit(): void {
    this.files$ = this.fileService.files$;
    this.fileService.findFiles().subscribe();
  }

  selectFile(event) {
   const selectedFile = this.selectedFiles[0];
   this.selectedFileService.saveObject(selectedFile);
  }

  onSubmit() {
    const uploadFile: PDDLFile = {
      _id: null,
      path: '',
      name: this.fileForm.controls.name.value,
      type: this.type,
      domain: this.fileForm.controls.domain.value,
      content: this.fileObject
    };

    this.fileService.saveDomainFile(uploadFile);
  }

  onUploadFileSelected() {
    const inputNode: any = document.querySelector('#file' + this.type);
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
