import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { User } from "src/app/interface/user";
import { passwordValidator } from "src/app/validators/user.validators";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
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
        await this.router.navigate(["/overview"], { relativeTo: this.route });
      },
      () => {
        // console.log('Register failed.');
      }
    );

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
