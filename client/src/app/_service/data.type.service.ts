import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class DataTypeService {
  constructor(private http: Http) {}

  getAllDataTypes() {
    return this.http.get('/mockdata/api/v1/types').map((response: Response) => response.json());
  }
}
