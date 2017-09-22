import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {User} from '../_models/index';

@Injectable()
export class UserService {
  constructor(private http: Http) {
  }

  create(user: User) {
    return this.http.post('/mockdata/api/v1/user', user).map((response: Response) => response.json());
  }
}
