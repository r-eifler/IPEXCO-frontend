import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { map, filter, take } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { MatSliderModule } from "@angular/material/slider";

interface Displayable {
  display: string;
}

@Component({
  selector: "app-object-slider",
  standalone: true,
  imports: [
    AsyncPipe,
    MatSliderModule,
  ],
  templateUrl: "./object-slider.component.html",
  styleUrls: ["./object-slider.component.scss"],
})
export class ObjectSliderComponent implements OnInit {
  @Input()
  set values(values: Displayable[]) {
    this.values$.next(values);
  }

  @Input()
  set selected(selected: any) {
    this.selected$.next(selected);
  }

  @Input() disabled: boolean;

  @Input()
  set showCost(showCost: boolean) {
    this.showCost$.next(showCost);
  }

  @Output() change = new EventEmitter<any>();

  min: number;
  max$ = new Observable<number>(null);
  value$ = new Observable<number>(null);

  values$ = new BehaviorSubject<Displayable[]>(null);
  selected$ = new BehaviorSubject<Displayable>(null);
  showCost$ = new BehaviorSubject<boolean>(null);

  constructor() {
    this.min = 0;

    this.max$ = this.values$.pipe(
      map((values) => (values ? values.length - 1 : 1))
    );

    this.value$ = combineLatest([this.values$, this.selected$]).pipe(
      filter(([values, selected]) => !!values && !!selected),
      map(([values, selected]) => values.indexOf(selected))
    );
  }

  ngOnInit(): void {}

  valueChanged($event) {
    console.log("Selected: " + $event.value);
    this.values$
      .pipe(
        filter((values) => !!values),
        take(1)
      )
      .subscribe((values) => this.change.emit(values[$event.value]));
  }
}
