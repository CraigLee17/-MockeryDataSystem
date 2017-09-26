import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {User} from "../_models/user";
import {SessionService} from "./session.service";

@Injectable()
export class AuthenticationService {
  constructor(private http: Http, private sessionService: SessionService) {
  }

  login(user: User) {
    return this.http.post('/mockdata/api/v1/login', user)
      .map((response: Response) => {
        let user = response.json();
        if (user) {
          this.sessionService.create(user);
        }
        return user;
      });
  }

  logout() {
    this.http.get('/mockdata/api/v1/logout');
    this.sessionService.destory();
  }
}
