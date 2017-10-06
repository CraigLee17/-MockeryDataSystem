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
  sessionService: SessionService;
  authenticationService: AuthenticationService;

  constructor(sessionService: SessionService, authenticationService: AuthenticationService) {
    this.sessionService = sessionService;
    this.authenticationService = authenticationService;
  }

  logout() {
    this.authenticationService.logout();
  }
}
