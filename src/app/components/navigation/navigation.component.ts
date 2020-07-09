import {takeUntil} from 'rxjs/operators';
import {AuthenticationService} from 'src/app/service/authentication/authentication.service';
import {LoginComponent} from './../login/login/login.component';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from '../../service/responsive/responsive.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';


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
    public userService: AuthenticationService,
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

  async logout() {
    await this.userService.logout();
    await this.router.navigate(['/'], {relativeTo: this.route});
  }

  userStudyPath() {
    const regExp = new RegExp('/user-studies/[a-zA-Z0-9]*/');
    return regExp.exec(this.router.url);
  }

}
