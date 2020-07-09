import {takeUntil} from 'rxjs/operators';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-demo-help',
  templateUrl: './demo-help.component.html',
  styleUrls: ['./demo-help.component.css']
})
export class DemoHelpComponent implements OnInit, OnDestroy {

  isMobile: boolean;

  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() next = new EventEmitter<void>();

  constructor(
    private responsiveService: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  nextStep() {
    this.next.emit();
  }
}
