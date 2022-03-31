import { PPConflict } from './../../../../interface/explanations';
import { DepExplanationRun, IterationStep } from 'src/app/interface/run';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-explanations-relaxations-view',
  templateUrl: './explanations-relaxations-view.component.html',
  styleUrls: ['./explanations-relaxations-view.component.scss']
})
export class ExplanationsRelaxationsViewComponent implements OnInit {

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }
  @Input()
  set depExplanation(depExplanation : DepExplanationRun){
    this.depExplanation$.next(depExplanation);
  }
  @Input()
  set conflict(c : PPConflict){
    this.conflict$.next(c);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private depExplanation$ = new BehaviorSubject<DepExplanationRun>(null);
  private conflict$ = new BehaviorSubject<PPConflict>(null);

  constructor() { }

  ngOnInit(): void {
  }

}
