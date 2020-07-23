import {takeUntil} from 'rxjs/operators';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {Subject} from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import {MatButton} from '@angular/material/button';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';

@Component({
  selector: 'app-demo-help',
  templateUrl: './demo-help.component.html',
  styleUrls: ['./demo-help.component.css']
})
export class DemoHelpComponent implements OnInit, OnDestroy {

  isMobile: boolean;
  canUseQuestions = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() next = new EventEmitter<void>();

  constructor(
    private settingsService: ExecutionSettingsService,
    private responsiveService: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();

    this.settingsService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        settings => {
          if (settings) {
            this.canUseQuestions = settings.allowQuestions;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  nextStep() {
    this.next.emit();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper, startButton: MatButton) {
    stepper.next();
    if (stepper.selectedIndex === 3) {
      startButton.disabled = false;
    }
  }

}
