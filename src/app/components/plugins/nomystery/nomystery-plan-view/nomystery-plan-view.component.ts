import { AnimationHandler } from './../../../../animation/animation-handler';
import { AnimationInitializerNoMystery } from './../../../../plugins/nomystery/animation-initializer-nomystery';
import { AnimationProvider } from 'src/app/animation/animation-provider';
import { AnimationInitializer } from 'src/app/animation/animation-initializer';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { TaskSchema } from 'src/app/interface/schema';
import { NoMysteryTask } from 'src/app/plugins/nomystery/nomystery-task';
import { TasktSchemaStore, CurrentRunStore } from 'src/app/store/stores.store';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  task: NoMysteryTask;

  animationHandler: AnimationHandler;

  planCost: string;
  private currentRun$: BehaviorSubject<PlanRun>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskSchemaStore: TasktSchemaStore,
    private  currentRunStore: CurrentRunStore) {

    this.currentRun$ = this.currentRunStore.item$;

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    combineLatest([this.taskSchemaStore.item$, this.currentRun$]).subscribe(([ts, run]) => {
          if (ts && run) {
            this.taskSchema = ts;
            this.task = new NoMysteryTask(this.taskSchema);

            this.animationHandler = new AnimationHandler(this.task, run.plan);
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

  newQuestion() {
    this.router.navigate(['./new-question'], { relativeTo: this.route });
  }

}


