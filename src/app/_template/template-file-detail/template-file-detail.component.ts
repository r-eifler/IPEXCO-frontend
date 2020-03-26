import {Component, OnInit, OnDestroy} from '@angular/core';

import {PDDLFile} from '../../_interface/pddlfile';
import {Observable} from 'rxjs';
import {SelectedDomainFileService} from '../../_service/selected-domain-file.service';


@Component({
  selector: 'app-template-file-detail',
  templateUrl: './template-file-detail.component.html',
  styleUrls: ['./template-file-detail.component.css']
})
export class TemplateFileDetailComponent implements OnInit {

  editorOptions = {theme: 'vs-light', language: 'javascript'};
  code = 'test';

  // files observable
  selectedFile$: Observable<PDDLFile>;

  constructor(private selectedFileService: SelectedDomainFileService) { }

  ngOnInit(): void {
    this.selectedFile$ = this.selectedFileService.selectedDomainFile$;
    this.selectedFile$.subscribe( (file) => { this.code = file ? file.name : ''; });
  }

}
