import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Demo} from '../../../interface/demo';

@Component({
  selector: 'app-user-study-demo-view',
  templateUrl: './user-study-demo-view.component.html',
  styleUrls: ['./user-study-demo-view.component.css']
})
export class UserStudyDemoViewComponent implements OnInit {

  @Input() demoId: string;
  @Output() next = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    this.next.emit();
  }
}
