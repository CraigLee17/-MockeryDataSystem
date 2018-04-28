import {Component, OnInit} from '@angular/core';
import {UserService} from "../_service/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../_models/user";
import {SessionService} from "../_service/session.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute, private userService: UserService, private sessionService: SessionService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.userService.getUserById(id).subscribe(
        user => this.user = user,
        error => console.log(error)
      );
    });
  }

  changeStatus(status) {
    if (this.user.id == this.sessionService.getUser().id) {
      alert("You can't change your own status!");
    } else {
      this.userService.updateUserStatus(this.user.id, status).subscribe(
        user => this.user = user,
        error => console.log(error)
      );
    }
  }

  changeRole(role) {
    if (this.user.id == this.sessionService.getUser().id) {
      alert("You can't change your own role!");
    } else {
      this.userService.updateUserRole(this.user.id, role).subscribe(
        user => this.user = user,
        error => console.log(error)
      );
    }
  }

}
