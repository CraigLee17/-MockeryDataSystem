import {Injectable} from "@angular/core"
import {User} from "../_models/user";

@Injectable()
export class SessionService {

  create(user: User) {
    sessionStorage.user = JSON.stringify(user);
  }

  destory() {
    delete sessionStorage.user;
  }

  isAuthenticated() {
    return sessionStorage.user && true;
  }

  getUser() {
    if (sessionStorage.user) {
      return JSON.parse(sessionStorage.user);
    } else {
      return null;
    }
  }

  isLogin() {
    const user = this.getUser();
    return user ? true : false;
  }

  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role ? true : false;
  }
}
