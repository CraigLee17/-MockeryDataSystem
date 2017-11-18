import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../_service/user.service";
import {User} from "../_models/user";
import {Router} from "@angular/router";
import {DatatableComponent} from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: [User];
  temp: [User];
  table: DatatableComponent;

  constructor(private userService: UserService, private router: Router) {
    userService.getAllUsers().subscribe(
      users => {
        this.users = users;
        this.temp = users;
      });
  }

  ngOnInit() {
  }

  selectUser(event) {
    if (event.type == 'click') {
      const user: User = event.row;
      this.router.navigate(['/users', user.id]);
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = <[User]>this.temp.filter(function (user) {
      return user.username.toLowerCase().indexOf(val) !== -1 || user.firstName.toLowerCase().indexOf(val) !== -1 ||
        user.lastName.toLowerCase().indexOf(val) !== -1 || user.email.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.users = temp;
    this.table.offset = 0;
  }
}
