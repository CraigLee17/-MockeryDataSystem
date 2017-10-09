import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../_models/user";
import {SessionService} from "./session.service";
import {Schema} from "../_models/schema";

@Injectable()
export class SchemaService {
  private user: User;

  constructor(private http: HttpClient, sessionService: SessionService) {
    this.user = sessionService.getUser();
  }

  getSchemasByUserId() {
    return this.http.get<[Schema]>('/mockdata/api/v1/user/' + this.user.id + '/schemas');
  }

  getSchemaById(id) {
    return this.http.get<Schema>('/mockdata/api/v1/user/' + this.user.id + '/schema/' + id);
  }

  create(schema: Schema) {
    return this.http.post('/mockdata/api/v1/user/' + this.user.id + '/schema', schema);
  }

  remove(id) {
    return this.http.delete('/mockdata/api/v1/user/' + this.user.id + '/schemas/' + id);
  }
}
