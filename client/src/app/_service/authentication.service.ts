import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {User} from "../_models/user";

@Injectable()
export class AuthenticationService {
  constructor(private http: Http) {
  }

  login(user: User) {
    return this.http.post('/mockdata/api/v1/login', user)
      .map((response: Response) => {
        const user = response.json();
        console.log(response);
      });
  }

  logout() {
    this.http.get('/mockdata/api/v1/logout');
  }
}
