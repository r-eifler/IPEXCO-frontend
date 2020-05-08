import { AnimationHandler } from './../../../../animation/animation-handler';
import { AnimationInitializerNoMystery } from './../../../../plugins/nomystery/animation-initializer-nomystery';
import { AnimationProvider } from 'src/app/animation/animation-provider';
import { AnimationInitializer } from 'src/app/animation/animation-initializer';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { TaskSchema } from 'src/app/interface/schema';
import { Task } from 'src/app/plugins/nomystery/task';
import { TasktSchemaStore, CurrentRunStore } from 'src/app/store/stores.store';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';


interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-nomystery-plan-view',
  templateUrl: './nomystery-plan-view.component.html',
  styleUrls: ['./nomystery-plan-view.component.css']
})
export class NomysteryPlanViewComponent implements OnInit, AfterViewInit {

  @ViewChild('planSVG') mapSVG: ElementRef;
  taskSchema: TaskSchema;
  task: Task;

  planActions: Action[];

  animationInitializer: AnimationInitializer;
  animationHandler: AnimationHandler;

  planCost: string;
  private currentRun$: BehaviorSubject<PlanRun>;

  constructor(
    private taskSchemaStore: TasktSchemaStore,
    private fileUtilsService: PddlFileUtilsService,
    private  currentRunStore: CurrentRunStore) {

    this.currentRun$ = this.currentRunStore.item$;

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.currentRun$.subscribe(run => {
      if (run !== null && run.plan !== undefined) {
        const planContent$ = this.fileUtilsService.getFileContent(run.plan);

        combineLatest([this.taskSchemaStore.item$, planContent$]).subscribe(([ts, content]) => {

          if (ts && content) {
            this.taskSchema = ts;
            this.task = new Task(this.taskSchema);
            console.log(this.task);

            const lines = content.split('\n');
            lines.splice(-1, 1); // remove empty line at the end
            const costString = lines.splice(-1, 1)[0];
            this.planCost = costString.split(' ')[3];
            this.planActions = this.formatActions(lines);

            const width = this.mapSVG.nativeElement.clientWidth;
            const height = this.mapSVG.nativeElement.clientHeight;
            this.animationHandler = new AnimationHandler(this.task, this.planActions, '#planSVG');
            this.animationHandler.nextEvents();
          }
        });
      }
    });
  }

  formatActions(actionStrings: string[]): Action[] {
    const res: Action[] = [];
    for (const a of actionStrings) {
      const action = a.replace('(', '').replace(')', '');
      const [name, ...args] = action.split(' ');
      res.push({name, args});
    }

    return res;
  }

}


