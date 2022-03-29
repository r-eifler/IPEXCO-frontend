import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conflict-view',
  templateUrl: './conflict-view.component.html',
  styleUrls: ['./conflict-view.component.scss']
})
export class ConflictViewComponent implements OnInit {

  @Input() question: string;
  @Input() explanation: string;


  constructor() { }

  ngOnInit(): void {
  }

}
