import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/interface/user';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isMobile: boolean;

  registerForm = new FormGroup({
    name: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private responsiveService: ResponsiveService,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }


  onLogin(): void {
    const newUser: User = {
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value
    };
    console.log(newUser);

    this.userService.login(newUser).then(
      () => {
        console.log('Login successful.');
        this.router.navigate(['/projects'], { relativeTo: this.route });
      },
      () => {
        console.log('Login failed.');
      }
    );


    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
