import {Observable} from 'rxjs';
import {CurrentRunService} from 'src/app/service/planner-runs/run-services';
import {TaskSchemaService} from 'src/app/service/task-info/schema.service';
import {Action} from 'src/app/interface/plan';
import {CurrentProjectService} from 'src/app/service/project/project-services';


export abstract class PlanVisualization {

  constructor(
    protected currentProjectService: CurrentProjectService,
    protected taskSchemaService: TaskSchemaService,
    protected  currentRunService: CurrentRunService) {
    }

  abstract async init(): Promise<void> ;
  abstract getDisplayDOMElem(): Observable<Element>;
  abstract upadte();
  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
  abstract restart(): void;
}
