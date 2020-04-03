import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PlanProperty} from '../../_interface/plan-property';

@Component({
  selector: 'app-template-property-selecter',
  templateUrl: './template-property-selector.component.html',
  styleUrls: ['./template-property-selector.component.css']
})
export class TemplatePropertySelectorComponent implements OnInit {

  collection = [
    {id: 1, name: 'use connection', formula: 'F drive t1 l1 l2'},
    {id: 1, name: 'delivery order', formula: '! unload p1 t1 l1 U unload p2 t1 l1'}
  ];

  softProperties = [
  ];

  hardProperties = [
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
