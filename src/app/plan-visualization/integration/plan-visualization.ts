import {Observable} from 'rxjs';
import {TaskSchemaService} from 'src/app/service/task-info/schema.service';
import {Action} from 'src/app/interface/plan';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {SelectedPlanRunService} from '../../service/planner-runs/selected-planrun.service';


export abstract class PlanVisualization {

  protected mainScale = 1.0;

  protected constructor(
    protected currentProjectService: CurrentProjectService,
    protected taskSchemaService: TaskSchemaService,
    protected  currentRunService: SelectedPlanRunService) {
    }

  async init(): Promise<void> {

  }
  abstract getDisplayDOMElem(): Observable<Element>;
  abstract getValueAttributesDisplayDOMElem(): Observable<Element>;
  abstract update();
  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
  abstract restart(): void;
  abstract scale(factor: number): void;
}
