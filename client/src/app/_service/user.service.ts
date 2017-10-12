import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models/index';
import {SessionService} from "./session.service";

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private sessionService: SessionService) {
  }

  create(user: User) {
    return this.http.post('/mockdata/api/v1/user', user);
  }

  getByEmail(email: string) {
    return this.http.get('/mockdata/api/v1/user/' + email);
  }

  getAllUsers() {
    let user = this.sessionService.getUser();
    return this.http.get<[User]>('/mockdata/api/v1/admin/' + user.id + '/users');
  }
}
