import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskSchema } from 'src/app/interface/schema';
import { Task, Road, Package, Truck, Node, Link, Location } from 'src/app/plugins/nomystery/task';
import { TasktSchemaStore, CurrentRunStore } from 'src/app/store/stores.store';
import * as d3 from 'd3';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { gsap } from 'gsap';
import { Animation, animateAction } from 'src/app/plugins/nomystery/animations';
import { simulateMap } from 'src/app/plugins/nomystery/map-simulation';
import { Simulation } from 'd3';

interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-nomystery-plan-view',
  templateUrl: './nomystery-plan-view.component.html',
  styleUrls: ['./nomystery-plan-view.component.css']
})
export class NomysteryPlanViewComponent implements OnInit {

  @ViewChild('planSVG') mapSVG: ElementRef;
  taskSchema: TaskSchema;
  task: Task;

  planActions: Action[];
  currentTimeStep = 0;
  simulation: Simulation<Node, Link<Node>>;

  planCost: string;
  private currentRun$: BehaviorSubject<PlanRun>;

  constructor(
    private taskSchemaStore: TasktSchemaStore,
    private fileUtilsService: PddlFileUtilsService,
    private  currentRunStore: CurrentRunStore) {

    this.currentRun$ = this.currentRunStore.item$;

    this.currentRun$.subscribe(run => {
      if (run !== null && run.plan !== undefined) {
        const planContent$ = this.fileUtilsService.getFileContent(run.plan);

        combineLatest([this.taskSchemaStore.item$, planContent$]).subscribe(([ts, content]) => {

          if (ts && content) {
            this.taskSchema = ts;
            this.task = new Task(this.taskSchema);

            const lines = content.split('\n');
            lines.splice(-1, 1); // remove empty line at the end
            const costString = lines.splice(-1, 1)[0];
            this.planCost = costString.split(' ')[3];
            this.planActions = this.formatActions(lines);

            const width = this.mapSVG.nativeElement.clientWidth;
            const height = this.mapSVG.nativeElement.clientHeight;
            this.simulation = simulateMap('#planSVG', this.task, width, height);
          }
        });
      }
    });

  }

  ngOnInit(): void {

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


  playAnimation() {
    // const rans = d3.transition().duration(100);
    // d3.select('#t1').transition(rans).attr('x', 400);
    if (this.currentTimeStep < this.planActions.length) {
      const animations = animateAction(this.planActions[this.currentTimeStep], this.task);
      // this.simulation.alpha(0.1).restart();
      // for (const animation of animations) {
      //   d3.select('#' + animation.id).transition(animation.transition);
      // }
      this.currentTimeStep++;
    }
  }

}


