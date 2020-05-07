import { Component, OnInit } from '@angular/core';
import {DomainFilesService, ProblemFilesService, SelectedDomainFileService} from '../../../service/pddl-file-services';
import {FilesService} from '../../../service/pddl-files.service';
import {SelectedObjectService} from '../../../service/selected-object.service';

@Component({
  selector: 'app-domain-selector',
  templateUrl: './domain-selector.component.html',
  styleUrls: ['./domain-selector.component.css'],
  providers: [
    {provide: FilesService, useClass: DomainFilesService},
    {provide: SelectedObjectService, useClass: SelectedDomainFileService},
    ]
})
export class DomainSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
