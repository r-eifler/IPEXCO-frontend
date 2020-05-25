import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  isMobile: boolean;

  constructor(private responsiveService: ResponsiveService) { }

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

  ngAfterViewChecked(): void {
    this.animateLogo();
  }

  animateLogo() {
    const tl = gsap.timeline();
    tl.from('#wts-logo', {duration: 0.5, x: 300,  ease: 'power4. out'});
    tl.from('#gts-logo', {duration: 0.5, x: 300,  ease: 'power4. out'});
    tl.from('#ots-logo', {duration: 0.5, x: 300,  ease: 'power4. out'});
    tl.from(['#xai-logo', '#explore-logo'], {duration: 1, x: -500,  ease: 'power4. out'});
  }

}
