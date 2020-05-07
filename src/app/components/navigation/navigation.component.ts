import { Component, OnInit} from '@angular/core';
import { ResponsiveService} from '../../service/responsive.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isMobile: boolean;

  constructor(private responsiveService: ResponsiveService) {

  }

  ngOnInit() {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.onResize();
  }

  onResize() {
    this.responsiveService.checkWidth();
  }


}
