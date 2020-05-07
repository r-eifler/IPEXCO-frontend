import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-mobil-menu',
  templateUrl: './mobil-menu.component.html',
  styleUrls: ['./mobil-menu.component.css']
})
export class MobilMenuComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<MobilMenuComponent>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }


  ngOnInit(): void {
  }


}
