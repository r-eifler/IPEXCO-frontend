import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';


@Component({
  selector: 'app-template-pddl-file',
  templateUrl: './template-pddl-file.component.html',
  styleUrls: ['./template-pddl-file.component.css']
})
export class TemplatePddlFileComponent implements OnInit {

  @Input() type;

  ngOnInit(): void {
  }
}
