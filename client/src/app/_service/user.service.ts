import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models/index';
import {SessionService} from "./session.service";

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private sessionService: SessionService) {
  }

  create(user: User) {
    return this.http.post('/mockdata/api/v1/users', user);
  }

  getAllUsers() {
    return this.http.get<[User]>(`/mockdata/api/v1/users`);
  }

  getUserById(id: String) {
    return this.http.get<User>(`/mockdata/api/v1/users/${id}`);
  }

  updateUser(user : User) {

  }
}
