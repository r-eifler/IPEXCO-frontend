import { takeUntil } from "rxjs/operators";
import { AuthenticationService } from "src/app/user/services/authentication.service";
import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Subject } from "rxjs";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule, MatNavList } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AsyncPipe, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Store } from "@ngrx/store";
import { selectIsUserStudy, selectLoggedIn, selectUserName } from "src/app/user/state/user.selector";
import { logout } from "src/app/user/state/user.actions";
import { LoginComponent } from "src/app/user/components/login/login.component";


@Component({
    selector: "app-navigation",
    imports: [
        RouterModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        NgIf,
        MatButtonModule,
        AsyncPipe,
        MatSidenavModule
    ],
    templateUrl: "./navigation.component.html",
    styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent{

  store = inject(Store)

  isLoggedIn$ = this.store.select(selectLoggedIn);
  isUserStudy$ = this.store.select(selectIsUserStudy);
  name$ = this.store.select(selectUserName);

  router = inject(Router);
  dialog = inject(MatDialog);

  newLoginForm(): void {
    this.dialog.open(LoginComponent)
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/'])
  }

}
