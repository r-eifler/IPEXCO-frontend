import { PPConflict, PPDependencies } from './../../../../interface/explanations';
import { PlanPropertyMapService } from '../../../../service/plan-properties/plan-property-services';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { PlanProperty } from '../../../../interface/plan-property/plan-property';
import { DepExplanationRun, RunStatus } from 'src/app/interface/run';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, tap, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-conflict-view',
  templateUrl: './conflict-view.component.html',
  styleUrls: ['./conflict-view.component.scss']
})
export class ConflictViewComponent implements OnInit {

  runStatus = RunStatus;

  @Input()
  set solvable(b: boolean){
    this.selectedConflictIndex = null;
    this.solvable$.next(b);
  }
  @Input()
  set question(question : PlanProperty){
    this.selectedConflictIndex = null;
    this.question$.next(question);
  }
  @Input()
  set explanation(explanation : PPDependencies){
    console.log(explanation);
    this.selectedConflictIndex = null;
    this.explanation$.next(explanation);
  }

  @Output() selectedConflict = new EventEmitter<PPConflict>();

  explanation$ = new BehaviorSubject<PPDependencies>(null);
  question$ = new BehaviorSubject<PlanProperty>(null);
  solvable$ = new BehaviorSubject<boolean>(null);

  dependencies$ : Observable<PlanProperty[][]>;
  planProperties$ : Observable<Map<string,PlanProperty>>;
  solvableAtAll$ : Observable<boolean>;

  selectedConflictIndex: number = null;

  constructor(
    planPropertiesService: PlanPropertyMapService
  ) {
    this.planProperties$ = planPropertiesService.getMap();

    this.dependencies$ = combineLatest([this.explanation$, this.planProperties$]).pipe(
      filter(([exp, planProperties]) => !!exp && !!planProperties),
      map(([exp, planProperties]) =>  exp.conflicts.map(con => con.elems.map(e => planProperties.get(e))))
    );

    this.solvableAtAll$ = this.dependencies$.pipe(
      map(dep => dep.filter(c => c.length == 0).length == 0)
    );
  }

  ngOnInit(): void {
  }

  selectConflict(c : PlanProperty[], index: number) {
    this.selectedConflictIndex = index;
    this.question$.pipe(take(1)).subscribe(
      question => this.selectedConflict.emit({elems: [question._id, ...c.map(pp => pp._id)]}));
    ;
  }

  selectPreferenceUnsolvable(index: number) {
    this.selectedConflictIndex = index;
    this.question$.pipe(take(1)).subscribe(
      question => this.selectedConflict.emit({elems: [question._id]}));
    ;
  }

  selectConflictStepUnsolvable(c : PlanProperty[], index: number) {
    this.selectedConflictIndex = index;
    this.selectedConflict.emit({elems: c.map(pp => pp._id)});
  }

}
