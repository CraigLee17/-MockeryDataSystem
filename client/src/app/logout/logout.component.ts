import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../_service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router,) {}

  ngOnInit() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

}
