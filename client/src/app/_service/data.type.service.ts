import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataType} from "../_models/data.type";

@Injectable()
export class DataTypeService {
  constructor(private http: HttpClient) {}

  getAllDataTypes() {
    return this.http.get<[DataType]>('/mockdata/api/v1/types');
  }
}
