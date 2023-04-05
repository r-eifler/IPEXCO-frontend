import { takeUntil } from "rxjs/operators";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { LoginComponent } from "./../login/login/login.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ResponsiveService } from "../../service/responsive/responsive.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: AuthenticationService,
    private responsiveService: ResponsiveService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  newLoginForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "200px";

    const dialog: MatDialogRef<LoginComponent> = this.dialog.open(
      LoginComponent,
      dialogConfig
    );

    dialog
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!res) {
          this.snackBar.open("Login failed.", "OK", {
            duration: 5000,
          });
        }
      });
  }

  async logout() {
    await this.userService.logout();
    await this.router.navigate(["/"], { relativeTo: this.route });
  }

  userStudyPath() {
    const regExp = new RegExp("/user-studies/[a-zA-Z0-9]*/");
    return regExp.exec(this.router.url);
  }
}
