import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models/index';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  create(user: User) {
    return this.http.post('/mockdata/api/v1/user', user);
  }

  getByEmail(email: string) {
    return this.http.get('/mockdata/api/v1/user/' + email);
  }
}
