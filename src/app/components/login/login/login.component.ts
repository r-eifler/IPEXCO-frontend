import { Component, inject, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { User } from "src/app/interface/user";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: "app-login",
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
    private responsiveService: ResponsiveService,
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntilDestroyed())
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
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
