import { Component, OnInit } from '@angular/core';
import {TaskSchemaService} from '../../../service/schema.service';
import {PlanPropertyMapService} from '../../../service/plan-property-services';
import {TaskSchema} from '../../../interface/task-schema';
import {PlanProperty} from '../../../interface/plan-property';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-demo-task-intro',
  templateUrl: './demo-task-intro.component.html',
  styleUrls: ['./demo-task-intro.component.css']
})
export class DemoTaskIntroComponent implements OnInit {

  taskSchema$ : Observable<TaskSchema>;
  planPropertiesMap$: Observable<Map<string, PlanProperty>>;

  constructor(
    taskSchemaService: TaskSchemaService,
    planPropertiesService: PlanPropertyMapService,
  ) {
    this.taskSchema$ = taskSchemaService.getSchema();
    this.planPropertiesMap$ = planPropertiesService.getMap();
  }

  ngOnInit(): void {
  }

}
