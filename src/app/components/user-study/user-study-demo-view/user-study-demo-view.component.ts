import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Demo} from '../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../service/demo-services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ExecutionSettingsService} from '../../../service/execution-settings.service';
import {DEMO_FINISHED_REDIRECT, PLANNER_REDIRECT, QUESTION_REDIRECT} from '../../../app.tokens';
import {DemoRunService, RunService} from '../../../service/run-services';
import {DemoPlannerService, PlannerService} from '../../../service/planner.service';

@Component({
  selector: 'app-user-study-demo-view',
  templateUrl: './user-study-demo-view.component.html',
  styleUrls: ['./user-study-demo-view.component.css'],
  providers: [
    {provide: RunService, useClass: DemoRunService},
    {provide: PlannerService, useClass: DemoPlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../' },
    { provide: QUESTION_REDIRECT, useValue: '../../../' },
  ]
})
export class UserStudyDemoViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  @Input() demoId: string;
  @Output() next = new EventEmitter<void>();

  step = 0;

  demo: Demo;

  constructor(
    private demosService: DemosService,
    private selectedDemoService: RunningDemoService,
    private settingsService: ExecutionSettingsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log(this.demoId);
    this.demosService.getObject(this.demoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        d => {
          console.log(d);
          if (d) {
            this.selectedDemoService.saveObject(d);
            this.settingsService.load(d.settings);
            this.demo = d;
          }
        }
      );
  }

  nextInternalStep() {
    this.step++;
  }

  nextStep() {
    this.next.emit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
