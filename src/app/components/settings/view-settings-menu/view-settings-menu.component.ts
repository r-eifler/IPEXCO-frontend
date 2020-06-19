import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ViewSettingsService } from 'src/app/service/setting.service';
import { defaultViewSettings, ViewSettings } from 'src/app/interface/view-settings';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings-menu.component.html',
  styleUrls: ['./view-settings-menu.component.css']
})
export class ViewSettingsMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  settings: ViewSettings;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ViewSettingsMenuComponent>,
    private viewSettingService: ViewSettingsService,
    ) {
      viewSettingService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(v => this.settings = v);
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateExpertView(event: MatSlideToggleChange) {
    this.settings.expertView = event.checked;
    this.viewSettingService.saveObject(this.settings);
  }

}
