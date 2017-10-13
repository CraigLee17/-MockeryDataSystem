import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {User} from "../_models/user";
import {SessionService} from "./session.service";

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  login(user: User) {
    return this.http.post<User>('/mockdata/api/v1/login', user);
  }

  logout() {
   return this.http.get('/mockdata/api/v1/logout');
  }

  getCurrentUser() {
    return this.sessionService.getUser();
  }
}
