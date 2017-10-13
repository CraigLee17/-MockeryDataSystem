import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../_service/authentication.service";
import {Router} from "@angular/router";
import {SessionService} from "../_service/session.service";

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router, private sessionService: SessionService) {
  }

  ngOnInit() {
    this.authenticationService.logout().subscribe(data => this.sessionService.destory());
    this.router.navigate(['/']);
  }

}
