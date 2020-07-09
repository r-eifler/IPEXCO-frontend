import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {DomainSpecificationFile} from 'src/app/interface/files';
import {DomainSpecificationFilesService} from 'src/app/service/pddl-file-services';
import {FilesService} from 'src/app/service/pddl-files.service';

@Component({
  selector: 'app-domain-specification',
  templateUrl: './domain-specification.component.html',
  styleUrls: ['./domain-specification.component.css'],
  providers: [
    {provide: FilesService, useClass: DomainSpecificationFilesService}
    ]
})
export class DomainSpecificationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
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
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
