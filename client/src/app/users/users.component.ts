import {Component, OnInit} from '@angular/core';
import {UserService} from "../_service/user.service";
import {User} from "../_models/user";
import {LocalDataSource} from 'ng2-smart-table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  source: LocalDataSource;

  settings = {
    columns: {
      username: {
        title: 'Username'
      },
      firstName: {
        title: 'First name'
      },
      lastName: {
        title: 'Last name'
      },
      email: {
        title: 'Email'
      },
      role: {
        title: 'Role',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager :{
      perPage: 9
    },
    noDataMessage: "Not user found!"
  };

  constructor(private userService: UserService) {
    userService.getAllUsers().subscribe(users => this.source = new LocalDataSource(users));
  }

  ngOnInit() {}

  selectUser(data, source) {
    console.log(data);
    console.log(source);

  }
}
