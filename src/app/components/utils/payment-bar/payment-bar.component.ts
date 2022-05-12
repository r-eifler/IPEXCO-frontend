import { Component, Input, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { PaymentInfo } from 'src/app/interface/settings/execution-settings';

@Component({
  selector: 'app-payment-bar',
  templateUrl: './payment-bar.component.html',
  styleUrls: ['./payment-bar.component.scss']
})
export class PaymentBarComponent implements OnInit {
  @Input()
  set min(min: number) {
    this.min$.next(min);
  }
  @Input()
  set max(max: number) {
    this.max$.next(max);
  }
  @Input()
  set value1(value1: number) {
    this.value1$.next(value1);
  }
  @Input()
  set value2(value2: number) {
    this.value2$.next(value2);
  }
  @Input()
  set paymentInfo(info: PaymentInfo) {
    console.log("Payment");
    this.paymentInfo$.next(info);
  }

  private unsubscribe$: Subject<any> = new Subject();

  min$ = new BehaviorSubject<number>(null);
  max$ = new BehaviorSubject<number>(null);
  value1$ = new BehaviorSubject<number>(null);
  value2$ = new BehaviorSubject<number>(null);

  paymentInfo$ = new BehaviorSubject<PaymentInfo>(null);

  v_small$: Observable<number>;
  v_large$: Observable<number>;
  left$: Observable<number>;
  width$: Observable<number>;
  null_pos$: Observable<number>;
  showPayment$: Observable<boolean>;
  paymentLevels$: Observable<number[][]>

  constructor() {
    this.v_small$ = combineLatest([this.value1$, this.value2$]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([value1, value2]) => value1 != null && value2 != null),
      map(([value1, value2]) => (value1 > value2 ? value2 : value1)),
      map(v => v < 0  ? 0 : v)
    );

    this.v_large$ = combineLatest([this.value1$, this.value2$]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([value1, value2]) => value1 != null && value2 != null),
      map(([value1, value2]) => (value1 < value2 ? value2 : value1))
    );

    this.left$ = combineLatest([
      this.min$,
      this.max$,
      this.v_small$,
      this.v_large$,
    ]).pipe(
      takeUntil(this.unsubscribe$),
      filter(
        ([min, max, v_small, v_large]) =>
          min != null && max != null && v_small != null && v_large != null
      ),
      map(([min, max, v_small, v_large]) => {
        let div = max - min;
        return (Math.abs(min - v_small) / div) * 100;
      })
    );

    this.width$ = combineLatest([
      this.min$,
      this.max$,
      this.v_small$,
      this.v_large$,
    ]).pipe(
      takeUntil(this.unsubscribe$),
      filter(
        ([min, max, v_small, v_large]) =>
          min != null && max != null && v_small != null && v_large != null
      ),
      map(([min, max, v_small, v_large]) => {
        let div = max - min;
        return ((v_large - v_small) / div) * 100;
      })
    );

    this.null_pos$ = combineLatest([this.min$, this.max$]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([min, max]) => min != null && max != null),
      map(([min, max]) => {
        let div = max - min;
        if (min < 0 && 0 < max) {
          return (Math.abs(min - 0) / div) * 100;
        }
      })
    );

    this.showPayment$ = this.paymentInfo$.pipe(
      takeUntil(this.unsubscribe$),
      map(info => !!info)
    );

    this.paymentLevels$ = combineLatest([
      this.min$,
      this.max$,
      this.v_small$,
      this.v_large$,
      this.paymentInfo$
    ]).pipe(
      takeUntil(this.unsubscribe$),
      filter(
        ([min, max, v_small, v_large, info]) =>
          min != null && max != null && v_small != null && v_large != null && info != null
      ),
      map(([min, max, v_small, v_large, info]) => {

        let div = max - min;
        let moneyDiv = info.max - info.min;
        let zeroPos = Math.abs(min)
        return info.steps.map(step => [((zeroPos + step * max) / div)* 100, info.min + step * moneyDiv])
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
