import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import { LoginComponent } from './../login/login/login.component';
import { RegisterComponent } from './../login/register/register.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService} from '../../service/responsive.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private responsiveService: ResponsiveService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.onResize();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onResize() {
    this.responsiveService.checkWidth();
  }

  newLoginForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '200px';

    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/'], { relativeTo: this.route });

  }

}
