import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DomainSpecificationFile } from 'src/app/interface/files';
import { DomainSpecificationFilesService } from 'src/app/service/pddl-file-services';
import { FilesService } from 'src/app/service/pddl-files.service';
import { SelectedObjectService } from 'src/app/service/selected-object.service';

@Component({
  selector: 'app-domain-specification',
  templateUrl: './domain-specification.component.html',
  styleUrls: ['./domain-specification.component.css'],
  providers: [
    {provide: FilesService, useClass: DomainSpecificationFilesService}
    ]
})
export class DomainSpecificationComponent implements OnInit {

  isMobile: boolean;

  type = 'DomainSpecification';

  // form fields
  fileForm = new FormGroup({
    name: new FormControl(),
    domain: new FormControl(),
    file: new FormControl(),
  });

  // uploaded file
  fileToUpload;
  fileObject;

  // files observable
  files$: Observable<DomainSpecificationFile[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private filesService: DomainSpecificationFilesService) {

      this.files$ = filesService.files$;
  }

  ngOnInit() {
    this.filesService.findFiles();
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.onResize();
  }

  onResize() {
    this.responsiveService.checkWidth();
  }

   onSubmit() {
     const uploadFile: DomainSpecificationFile = {
       _id: null,
       path: '',
       name: this.fileForm.controls.name.value,
       type: this.type,
       domain: this.fileForm.controls.domain.value,
       content: this.fileObject
     };

     this.filesService.saveFile(uploadFile);
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

   deleteFile(file: DomainSpecificationFile) {
     console.log(file);
     this.filesService.deleteFile(file);
   }

}
