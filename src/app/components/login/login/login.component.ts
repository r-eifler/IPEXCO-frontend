import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { Store } from "@ngrx/store";
import { login } from "src/app/user/state/user.actions";
import { selectLoggedIn, selectUserError } from "src/app/user/state/user.selector";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatIconModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  loginForm = new UntypedFormGroup({
    name: new UntypedFormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(32),
      ]),
    password: new UntypedFormControl([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]),
  });

  snackBar = inject(MatSnackBar);

  store = inject(Store)

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.loginSuccessful$.pipe(
      takeUntilDestroyed(),
      filter(loggedIn => loggedIn)
    ).subscribe(() =>
      this.dialogRef.close(false)
    );
  }

  ngOnInit(): void {
    
  }

  loginFailed$ = this.store.select(selectUserError);
  loginSuccessful$ = this.store.select(selectLoggedIn);

  onLogin(): void {
    
    const name = this.loginForm.controls.name.value;
    const password = this.loginForm.controls.password.value;

    this.store.dispatch(login({name, password}))
  }

  onBack(): void {
    this.dialogRef.close(false);
  }
}
