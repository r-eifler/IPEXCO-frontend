import { Component, OnInit } from '@angular/core';
import {PddlFilesService} from '../../../service/pddl-files.service';
import {ProblemFilesService, SelectedProblemFileService} from '../../../service/pddl-file-services';
import {SelectedObjectService} from '../../../service/selected-object.service';

@Component({
  selector: 'app-problem-selector',
  templateUrl: './problem-selector.component.html',
  styleUrls: ['./problem-selector.component.css'],
  providers: [
    {provide: PddlFilesService, useClass: ProblemFilesService},
    {provide: SelectedObjectService, useClass: SelectedProblemFileService},
    ]
})
export class ProblemSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
