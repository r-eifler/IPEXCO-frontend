import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { gsap } from 'gsap';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewChecked {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    public dialog: MatDialog) { }

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

  newRegisterForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      project: null,
    };

    const dialogRef = this.dialog.open(RegisterComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
