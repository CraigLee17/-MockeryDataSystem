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
    return this.http.get<[Schema]>(`/mockdata/api/v1/users/${id}/schemas`);
  }

  getSchemaById(id) {
    return this.http.get<Schema>(`/mockdata/api/v1/schemas/${id}`);
  }

  create(schema: Schema) {
    return this.http.post(`/mockdata/api/v1/schemas`, schema);
  }

  remove(id) {
    return this.http.delete(`/mockdata/api/v1/schemas/${id}`);
  }

  previewBySchemaId(id) {
    return this.http.get(`/mockdata/api/v1/schemas/${id}/preview`);
  }
}
