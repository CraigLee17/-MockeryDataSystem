import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_service/index';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {User} from "../_models/index";
import {Router} from "@angular/router";
import {SessionService} from "../_service/session.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  login(user: User) {
    this.authenticationService.login(user)
      .subscribe(
        data => {
          this.sessionService.create(data);
          this.loginForm.reset();
          this.router.navigate(['/home']);
        },
        error => {
          console.log(error);
        });
  }

}
