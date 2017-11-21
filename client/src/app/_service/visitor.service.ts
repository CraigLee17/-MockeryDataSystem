import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VisitorService {
  constructor(private http: HttpClient) {
  }

  preview() {
    return this.http.get('/mockdata/api/v1/visitor/preview');
  }
}
