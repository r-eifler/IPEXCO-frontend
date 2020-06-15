import { UserService } from './../../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interface/user';
import { passwordValidator } from 'src/app/validators/user.validators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)])},
    [passwordValidator]
  );

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    const newUser: User = {
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value
    };
    console.log(newUser);

    this.userService.register(newUser).then(
      () => {
        console.log('Register successdul.');
        this.router.navigate(['/projects'], { relativeTo: this.route });
      },
      () => {
        console.log('Register failed.');
      }
    );


    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
