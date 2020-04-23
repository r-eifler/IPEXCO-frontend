import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { CurrentRunStore, CurrentQuestionStore } from 'src/app/store/stores.store';
import { PlanRun, ExplanationRun } from 'src/app/interface/run';

@Component({
  selector: 'app-explanation-view',
  templateUrl: './explanation-view.component.html',
  styleUrls: ['./explanation-view.component.css']
})
export class ExplanationViewComponent implements OnInit {
  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  mugs: string;

  constructor(
    private fileUtilsService: PddlFileUtilsService,
    private  currentRunStore: CurrentRunStore,
    private currentQuestionStore: CurrentQuestionStore) {
    this.currentRun$ = this.currentRunStore.item$;
    this.currentQuestion$ = this.currentQuestionStore.item$;
  }

ngOnInit(): void {
    this.currentQuestion$.subscribe(run => {
      if (run !== null) {
        this.fileUtilsService.getFileContent(run.result).subscribe(content => {
          this.mugs = content;
        });
      }
    });

}

}
