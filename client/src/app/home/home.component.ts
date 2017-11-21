import {Component, OnInit} from '@angular/core';
import {VisitorService} from "../_service/visitor.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rows;
  headers;

  constructor(private visitorService: VisitorService) {
  }

  ngOnInit() {
  }

  preview() {
    if (!this.rows) {
      this.visitorService.preview().subscribe(mockData => {
          this.rows = mockData;
          this.buildHeaders();
        },
        error => console.log(error));
    }
  }

  buildHeaders() {
    const headers = [];
    for (let name in this.rows[0]) {
      headers.push({prop: name});
    }
    this.headers = headers;
  }
}
