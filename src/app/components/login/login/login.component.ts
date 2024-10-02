import { takeUntil } from "rxjs/operators";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { User } from "src/app/interface/user";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  isMobile: boolean;

  registerForm = new UntypedFormGroup({
    name: new UntypedFormControl(),
    password: new UntypedFormControl(),
  });

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
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value,
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
        this.dialogRef.close(false);
      }
    );
  }

  onBack(): void {
    this.dialogRef.close(false);
  }
}
