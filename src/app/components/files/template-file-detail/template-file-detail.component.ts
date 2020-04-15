import {Component, OnInit, OnDestroy} from '@angular/core';

import {PDDLFile} from '../../../_interface/pddlfile';
import {Observable} from 'rxjs';
import {SelectedObjectService} from '../../../_service/selected-object.service';
import {PddlFileUtilsService} from '../../../_service/pddl-file-utils.service';


@Component({
  selector: 'app-template-file-detail',
  templateUrl: './template-file-detail.component.html',
  styleUrls: ['./template-file-detail.component.css']
})
export class TemplateFileDetailComponent implements OnInit {

  editorOptions = {theme: 'vs-light', language: 'text/plain'};
  code = '';

  // files observable
  selectedFile$: Observable<PDDLFile>;

  constructor(private selectedFileService: SelectedObjectService<PDDLFile>, private fileContentService: PddlFileUtilsService) { }

  ngOnInit(): void {
    this.selectedFile$ = this.selectedFileService.selectedObject$;
    this.selectedFile$.subscribe(
      (file) => {
        if (file) {
          this.fileContentService.getFileContent(file.path).subscribe(
            (content) => {
              this.code = content;
            }
          );
        }
      });
  }

}
