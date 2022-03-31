import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';

@Component({
  selector: 'app-finished-step-navigator',
  templateUrl: './finished-step-navigator.component.html',
  styleUrls: ['./finished-step-navigator.component.scss']
})
export class FinishedStepNavigatorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  showTab = 5;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();

    this.step$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(step => {
        if (step && (step.canBeModified() || ! step.hasPlan())){
          this.showTab = 1;
          return;
        }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
