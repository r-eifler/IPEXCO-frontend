import { takeUntil } from "rxjs/operators";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { LoginComponent } from "./../login/login/login.component";
import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Subject } from "rxjs";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";


@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    NgIf,
    MatButtonModule,
  ],
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: AuthenticationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
