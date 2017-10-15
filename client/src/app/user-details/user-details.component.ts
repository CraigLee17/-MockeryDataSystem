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

  /*  user = {
      "email": "123@qq.com",
      "status": true,
      "role": "admin",
      "lastName": "li",
      "firstName": "Zhiyuan",
      "username": "craig",
      "id": "59c56267238fdc3c682e02aa"
    };*/


  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.userService.getUserById(id).subscribe(
        user => this.user = user,
        error => console.log(error)
      );
    });
  }
}
