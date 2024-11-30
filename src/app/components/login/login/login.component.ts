import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { User } from "src/app/interface/user";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatIconModule,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  isMobile: boolean;

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

  constructor(
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }

  onLogin(): void {
    const newUser: User = {
      name: this.loginForm.controls.name.value,
      password: this.loginForm.controls.password.value,
    };
    // console.log(newUser);

    this.userService.login(newUser).then(
      async () => {
        // console.log('Login successful.');
        this.dialogRef.close(true);
        await this.router.navigate(["/overview"], { relativeTo: this.route });
      },
      async () => {
        // console.log('Login failed.');
        this.snackBar.open('Login failed!', 'OK');
        // this.dialogRef.close(false);
      }
    );
  }

  onBack(): void {
    this.dialogRef.close(false);
  }
}
