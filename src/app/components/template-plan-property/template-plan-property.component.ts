import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-plan-property',
  templateUrl: './template-plan-property.component.html',
  styleUrls: ['./template-plan-property.component.css']
})
export class TemplatePlanPropertyComponent implements OnInit {

  planProperty = {id: 1, name: 'use connection', formula: 'F drive t1 l1 l2'};

  constructor() { }

  ngOnInit(): void {
  }

}
