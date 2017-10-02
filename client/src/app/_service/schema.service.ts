import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {User} from "../_models/user";
import {SessionService} from "./session.service";

@Injectable()
export class SchemaService {
  private user : User;

  constructor(private http: Http, sessionService: SessionService) {
    this.user = sessionService.getUser();
  }

  getSchemasByUserId() {
    return this.http.get('/mockdata/api/v1/user/' + this.user.id + '/schemas').map((response: Response) => response.json());
  }
}
