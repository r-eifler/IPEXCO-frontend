import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-template-file-detail',
  templateUrl: './template-file-detail.component.html',
  styleUrls: ['./template-file-detail.component.css']
})
export class TemplateFileDetailComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  private _file;
  editorOptions = {theme: 'vs-light', language: 'javascript'};
  code = 'test';

  constructor() { }

  ngOnInit(): void {
  }

  // @Input() set file(newFile: any) {
  //   this._file = newFile;
  //   this.code = newFile.name;
  // }
}
