import { Observable } from 'rxjs';
import { DemosService } from './../../../service/demo-services';
import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { MobilMenuComponent } from 'src/app/components/settings/mobil-menu/mobil-menu.component';
import { DemoSettingsComponent } from '../demo-settings/demo-settings.component';
import { Demo } from 'src/app/interface/demo';
import { RunStatus } from 'src/app/interface/run';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-demo-sellection',
  templateUrl: './demo-sellection.component.html',
  styleUrls: ['./demo-sellection.component.scss']
})
export class DemoSellectionComponent implements OnInit {

  isMobile: boolean;

  runStatus = RunStatus;
  public demos$: Observable<Demo[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private demosService: DemosService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar
    ) {
      this.demos$ = demosService.getList();
    }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();

    this.demosService.findCollection();
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
    console.log(demo);
  }

  openMenu() {
    this.bottomSheet.open(DemoSettingsComponent);
  }

}
