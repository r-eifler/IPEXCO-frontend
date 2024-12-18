import { AsyncPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";

interface Displayable {
  display: string;
  value: number;
}

@Component({
    selector: "app-object-progress-bar",
    imports: [
        AsyncPipe,
        MatIconModule,
    ],
    templateUrl: "./object-progress-bar.component.html",
    styleUrls: ["./object-progress-bar.component.scss"]
})
export class ObjectProgressBarComponent implements OnInit {
  @Input()
  set values(values: Displayable[]) {
    this.values$.next(values);
  }

  @Input()
  set selected(selected: any) {
    this.selected$.next(selected);
  }

  @Input()
  set showCost(showCost: boolean) {
    this.showCost$.next(showCost);
  }

  value$ = new Observable<number>(null);

  values$ = new BehaviorSubject<Displayable[]>(null);
  selected$ = new BehaviorSubject<Displayable>(null);

  showCost$ = new BehaviorSubject<boolean>(null);

  constructor() {
    this.value$ = combineLatest([this.values$, this.selected$]).pipe(
      filter(([values, selected]) => !!values && !!selected),
      map(
        ([values, selected]) =>
          (values.indexOf(selected) / (values.length - 1)) * 100
      )
    );
  }

  ngOnInit(): void {}
}
