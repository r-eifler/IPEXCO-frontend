import { Plan } from '../../../../interface/plan';
import {Component, Input, OnInit} from '@angular/core';
import {FilesService} from '../../../../service/pddl-files.service';
import {PddlFileUtilsService} from '../../../../service/pddl-file-utils.service';
import {CurrentRunStore} from '../../../../store/stores.store';
import {BehaviorSubject} from 'rxjs';
import {PlanRun} from '../../../../interface/run';

interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-plan-view',
  templateUrl: './plan-view.component.html',
  styleUrls: ['./plan-view.component.css']
})
export class PlanViewComponent implements OnInit {

  plan: Plan;
  private currentRun$: BehaviorSubject<PlanRun>;

    constructor(
      private fileUtilsService: PddlFileUtilsService,
      private  currentRunStore: CurrentRunStore) {
      this.currentRun$ = this.currentRunStore.item$;
    }

  ngOnInit(): void {
      this.currentRun$.subscribe(run => {
        if (run) {
          this.plan = run.plan;
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
