import { Component, OnInit } from '@angular/core';
import {DomainFilesService, ProblemFilesService, SelectedDomainFileService} from '../../../_service/pddl-file-services';
import {PddlFilesService} from '../../../_service/pddl-files.service';
import {SelectedObjectService} from '../../../_service/selected-object.service';

@Component({
  selector: 'app-domain-selector',
  templateUrl: './domain-selector.component.html',
  styleUrls: ['./domain-selector.component.css'],
  providers: [
    {provide: PddlFilesService, useClass: DomainFilesService},
    {provide: SelectedObjectService, useClass: SelectedDomainFileService},
    ]
})
export class DomainSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
