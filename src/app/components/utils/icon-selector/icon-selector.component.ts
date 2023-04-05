import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss']
})
export class IconSelectorComponent implements OnInit {

  iconsList = [
    "star",
    "battery_full",
    "attach_money",
    "departure_board",
    "fastfood",
    "directions_bus",
    "local_shipping",
    "cancel",
    "event_available",
    "event_busy",
    "priority_high",
    "child_care",
    "fitness_center",
    "free_breakfast",
    "mood",
    "mood_bad",
    "group",

  ]

  constructor(public dialogRef: MatDialogRef<IconSelectorComponent>) {

  }

  ngOnInit(): void {
  }

  close(icon: string){
    this.dialogRef.close(icon);
  }

}
