import { AsyncPipe, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { LoginComponent } from "src/app/user/components/login/login.component";
import { logout } from "src/app/user/state/user.actions";
import { selectIsUserStudy, selectLoggedIn, selectUserName } from "src/app/user/state/user.selector";


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
export class BelugaNavigationComponent{

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
