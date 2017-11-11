import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from "./session.service";
import {Schema} from "../_models/schema";
import {MockData} from "../_models/mock.data";

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

  update(schema) {
    return this.http.put(`/mockdata/api/v1/schemas/${schema.id}`, schema);
  }

  previewBySchemaId(id) {
    return this.http.get<MockData>(`/mockdata/api/v1/schemas/${id}/preview`);
  }
}
