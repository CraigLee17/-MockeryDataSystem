import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_service/authentication.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {User} from "../_models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  login(user: User) {
    this.authenticationService.login(user)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  logout() {
    this.authenticationService.logout();
  }
}
