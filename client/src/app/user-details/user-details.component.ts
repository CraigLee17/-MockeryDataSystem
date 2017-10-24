import {Component, OnInit} from '@angular/core';
import {UserService} from "../_service/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../_models/user";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute, private userService: UserService) {
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
    this.user.status = status;
    this.userService.updateUser(this.user);
  }

  changeRole(role) {
    this.user.role = role;
    this.userService.updateUser(this.user);
  }

}
