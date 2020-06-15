import { UserService } from 'src/app/service/user.service';
import { LoginComponent } from './../login/login/login.component';
import { RegisterComponent } from './../login/register/register.component';
import { Component, OnInit} from '@angular/core';
import { ResponsiveService} from '../../service/responsive.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private responsiveService: ResponsiveService,
    public dialog: MatDialog) {

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

  newLoginForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '200px';

    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/'], { relativeTo: this.route });

  }

}
