import {Component, Input, OnInit} from '@angular/core';
import {PddlFilesService} from '../../../service/pddl-files.service';
import {PddlFileUtilsService} from '../../../service/pddl-file-utils.service';
import {CurrentRunStore} from '../../../store/stores.store';
import {BehaviorSubject} from 'rxjs';
import {PlanRun} from '../../../interface/run';

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

  planActions: Action[];
  planCost: string;
  private currentRun$: BehaviorSubject<PlanRun>;

    constructor(
      private fileUtilsService: PddlFileUtilsService,
      private  currentRunStore: CurrentRunStore) {
      this.currentRun$ = this.currentRunStore.item$;
    }

  ngOnInit(): void {
      this.currentRun$.subscribe(run => {
        console.log(run);
        if (run !== null && run.plan !== undefined) {
          this.fileUtilsService.getFileContent(run.plan).subscribe(content => {
            const lines = content.split('\n');
            lines.splice(-1, 1); // remove empty line at the end
            const costString = lines.splice(-1, 1)[0];
            this.planCost = costString.split(' ')[3];
            console.log(lines);
            this.planActions = this.formatActions(lines);
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
