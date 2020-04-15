import {Component, Input, OnInit} from '@angular/core';
import {PddlFilesService} from '../../../_service/pddl-files.service';
import {PddlFileUtilsService} from '../../../_service/pddl-file-utils.service';
import {CurrentRunStore} from '../../../store/stores.store';
import {BehaviorSubject} from 'rxjs';
import {PlanRun} from '../../../_interface/run';

class T {
}

@Component({
  selector: 'app-plan-view',
  templateUrl: './plan-view.component.html',
  styleUrls: ['./plan-view.component.css']
})
export class PlanViewComponent implements OnInit {

  planActions: string[];
  private currentRun$: BehaviorSubject<PlanRun>;

    constructor(
      private fileUtilsService: PddlFileUtilsService,
      private  currentRunStore: CurrentRunStore) {
      this.currentRun$ = this.currentRunStore.item$;
    }

  ngOnInit(): void {
      this.currentRun$.subscribe(run => {
        if (run !== null) {
          this.fileUtilsService.getFileContent(run.plan).subscribe(content => {
            this.planActions = content.split('\n');
          });
        }
      });

  }

}
