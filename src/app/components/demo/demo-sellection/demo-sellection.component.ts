import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { MobilMenuComponent } from 'src/app/components/settings/mobil-menu/mobil-menu.component';
import { DemoSettingsComponent } from '../demo-settings/demo-settings.component';

@Component({
  selector: 'app-demo-sellection',
  templateUrl: './demo-sellection.component.html',
  styleUrls: ['./demo-sellection.component.scss']
})
export class DemoSellectionComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private bottomSheet: MatBottomSheet
    ) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  openMenu() {
    this.bottomSheet.open(DemoSettingsComponent);
  }

}
