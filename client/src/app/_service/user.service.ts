import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models/index';
import {SessionService} from "./session.service";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
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

  updateUserStatus(id: String, status: Boolean) {
    return this.http.put<User>(`/mockdata/api/v1/users/${id}/status`, {status: status});
  }

  updateUserRole(id: String, role: String) {
    return this.http.put<User>(`/mockdata/api/v1/users/${id}/role`, {role: role});
  }
}
