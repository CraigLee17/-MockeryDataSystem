import {Component} from '@angular/core';
import {SessionService} from "./_service/session.service";
import {User} from "./_models/user";
import {AuthenticationService} from "./_service/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }
}
