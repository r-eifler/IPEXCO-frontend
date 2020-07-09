import {Component, OnInit} from '@angular/core';
import {FilesService} from '../../../service/files/pddl-files.service';
import {ProblemFilesService} from '../../../service/files/pddl-file-services';
import {SelectedObjectService} from '../../../service/base/selected-object.service';

@Component({
  selector: 'app-problem-selector',
  templateUrl: './problem-selector.component.html',
  styleUrls: ['./problem-selector.component.css'],
  providers: [
      {provide: FilesService, useClass: ProblemFilesService}
    ]
})
export class ProblemSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
