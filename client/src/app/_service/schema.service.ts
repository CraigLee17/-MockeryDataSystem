import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../_models/user";
import {SessionService} from "./session.service";
import {Schema} from "../_models/schema";

@Injectable()
export class SchemaService {
  private sessionService: SessionService;

  constructor(private http: HttpClient, sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  getSchemasByUserId(id) {
    return this.http.get<[Schema]>(`/mockdata/api/v1/user/${id}/schemas`);
  }

  getSchemaById(id) {
    let user = this.sessionService.getUser();
    return this.http.get<Schema>(`/mockdata/api/v1/user/${user.id}/schemas/${id}`);
  }

  create(schema: Schema) {
    let user = this.sessionService.getUser();
    return this.http.post(`/mockdata/api/v1/user/${user.id}/schema`, schema);
  }

  remove(id) {
    let user = this.sessionService.getUser();
    return this.http.delete(`/mockdata/api/v1/user/${user.id}/schemas/${id}`);
  }

  previewBySchemaId(id) {
    let user = this.sessionService.getUser();
    return this.http.get(`/mockdata/api/v1/user/${user.id}/schemas/${id}/preview`);
  }
}
