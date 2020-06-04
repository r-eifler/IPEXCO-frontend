import { CurrentRunService } from 'src/app/service/run-services';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { Action } from 'src/app/interface/plan';
import { Injectable, ElementRef } from '@angular/core';


// @Injectable({
//   providedIn: 'root'
// })
export abstract class PlanVisualization {

  constructor(
    protected taskSchemaService: TaskSchemaService,
    protected  currentRunService: CurrentRunService) {
      console.log('PlanVisualization main class');
    }

  abstract async init(): Promise<void> ;
  abstract displayIn(canvas: ElementRef);
  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
  abstract restart(): void;
}
