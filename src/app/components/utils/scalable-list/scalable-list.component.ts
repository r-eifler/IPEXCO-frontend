import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scalable-list',
  templateUrl: './scalable-list.component.html',
  styleUrls: ['./scalable-list.component.css']
})
export class ScalableListComponent implements OnInit {

  @Input() icon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
