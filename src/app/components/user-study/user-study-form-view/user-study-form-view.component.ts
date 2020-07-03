import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-study-form-view',
  templateUrl: './user-study-form-view.component.html',
  styleUrls: ['./user-study-form-view.component.css']
})
export class UserStudyFormViewComponent implements OnInit {

  @Input() url;
  @Output() next = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    this.next.emit();
  }

}
