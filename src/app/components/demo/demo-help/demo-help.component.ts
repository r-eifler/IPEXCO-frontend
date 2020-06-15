import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';

@Component({
  selector: 'app-demo-help',
  templateUrl: './demo-help.component.html',
  styleUrls: ['./demo-help.component.css']
})
export class DemoHelpComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
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

}
