import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-user-study-form-view',
  templateUrl: './user-study-form-view.component.html',
  styleUrls: ['./user-study-form-view.component.css']
})
export class UserStudyFormViewComponent implements OnInit {

  @Input() url;
  @Output() next = new EventEmitter<void>();

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  nextStep() {
    this.next.emit();
  }

  makeTrustedURL(url: string) {
    const tUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url + '?embedded=true');
    return tUrl;
  }

}
