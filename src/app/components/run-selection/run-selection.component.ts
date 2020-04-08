import { Component, OnInit } from '@angular/core';
import {PlannerService} from '../../_service/planner.service';
import {RunsStore} from '../../store/stores.store';
import {Observable} from 'rxjs';
import {Run} from '../../_interface/run';

@Component({
  selector: 'app-run-selection',
  templateUrl: './run-selection.component.html',
  styleUrls: ['./run-selection.component.css']
})
export class RunSelectionComponent implements OnInit {
  runs$: Observable<Run[]>;

  selectedRuns: Run[];
  selectedRun: Run;

  constructor(private plannerService: PlannerService, private runStore: RunsStore) {
    this.runs$ = runStore.items$;
  }

  ngOnInit(): void {
    this.plannerService.findCollection();
  }

  selectRun(event): void {
    this.selectedRun = this.selectedRuns[0];
    console.log(this.selectedRun);
  }

  deleteRun(run): void {
    this.plannerService.deleteObject(run);
  }

}
