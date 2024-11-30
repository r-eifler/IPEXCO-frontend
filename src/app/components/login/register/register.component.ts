import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { User } from "src/app/interface/user";
import { passwordValidator } from "src/app/validators/user.validators";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatError, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    MatIconModule,
    MatError,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

  registerForm = new UntypedFormGroup(
    {
      name: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(32),
      ]),
      password: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
      ]),
      passwordRepeat: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
      ]),
    },
    [passwordValidator]
  );

  snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private userService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onRegister(): void {
    const newUser: User = {
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value,
    };
    // console.log(newUser);

    this.userService.register(newUser).then(
      async () => {
        // await this.router.navigate(["/overview"], { relativeTo: this.route });
        this.snackBar.open('Register successful. YOu can now login.', 'OK');
      },
      () => {
        // console.log('Register failed.');
        this.snackBar.open('Register failed.', 'OK');
      }
    );

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
