import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ViewSettingsService } from 'src/app/service/setting.service';
import { defaultViewSettings, ViewSettings } from 'src/app/interface/view-settings';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings-menu.component.html',
  styleUrls: ['./view-settings-menu.component.css']
})
export class ViewSettingsMenuComponent implements OnInit {

  settings: ViewSettings;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ViewSettingsMenuComponent>,
    private viewSettingService: ViewSettingsService,
    ) {
      viewSettingService.getSelectedObject().subscribe(v => this.settings = v);
    }

  ngOnInit(): void {
  }

  updateExpertView(event: MatSlideToggleChange) {
    console.log(this.settings);
    this.settings.expertView = event.checked;
    this.viewSettingService.saveObject(this.settings);
    console.log(this.settings);
  }

}
