import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DemosService, RunningDemoService } from '../../../service/demo-services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { MobilMenuComponent } from 'src/app/components/settings/mobil-menu/mobil-menu.component';
import { DemoSettingsComponent } from '../demo-settings/demo-settings.component';
import { Demo } from 'src/app/interface/demo';
import { RunStatus } from 'src/app/interface/run';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';

@Component({
  selector: 'app-demo-selection',
  templateUrl: './demo-selection.component.html',
  styleUrls: ['./demo-selection.component.scss']
})
export class DemoSelectionComponent implements OnInit, OnDestroy {

  isMobile: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;
  public demos$: Observable<Demo[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

      this.demos$ = demosService.getList();
    }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();

    this.demosService.findCollection();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteDemo(demo: Demo): void {
    this.demosService.deleteObject(demo);
  }

  async cancelDemo(demo: Demo): Promise<void> {
    const canceld = await this.demosService.cancelDemo(demo);
    console.log(canceld);
    if (canceld) {
      this.snackBar.open('Demo canceld successfully!', 'close', {duration: 2000});
    } else {
      this.snackBar.open('Cancel demo failed!', 'close', {duration: 2000});
    }

  }

  openDemo(demo: Demo): void {
    this.router.navigate(['../demos/' + demo._id + '/help'], {relativeTo: this.activatedRoute});
  }

  openSettings(demo: Demo) {
    console.log('Open Settings: ');
    console.log(demo);
    this.bottomSheet.open(DemoSettingsComponent, {data: demo});
  }

}
