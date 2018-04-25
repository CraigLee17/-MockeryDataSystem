import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchemaService} from "../_service/schema.service";
import {Schema} from "../_models/schema";
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.css']
})
export class SchemaDetailsComponent implements OnInit {
  schema: Schema;
  rows;
  headers;
  userid: string;
  exist: boolean;
  spinner: boolean = false;

  constructor(private route: ActivatedRoute, private schemaService: SchemaService, private spinnerService: Ng4LoadingSpinnerService) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.userid = params['userid'];
      this.schemaService.getSchemaById(id).subscribe(
        schema => {
          this.schema = schema;
          this.checkIfGenerate();
          this.spinner = true;
        },
        error => console.log(error)
      );
    });
  }

  ngOnInit() {
  }

  generate() {
    this.spinnerService.show();
    this.schemaService.generateMockData(this.schema.id).subscribe(
      data => {
        this.spinnerService.hide();
        this.exist = true;
        alert("Data generation is done!");
      },
      error => {
        this.spinnerService.hide();
        alert("Data generation fails!");
        console.log(error);
      }
    );
  }

  checkIfGenerate() {
    this.schemaService.checkIfGenerate(this.schema.id).subscribe(
      res => this.exist = res,
      error => console.log(error)
    );
  }

  preview() {
    if (!this.rows) {
      this.schemaService.previewBySchemaId(this.schema.id).subscribe(
        mockData => {
          this.rows = mockData.data;
          this.buildHeaders();
        },
        error => console.log(error)
      );
    }
  }

  // build headers for table base on mock data fields name
  buildHeaders() {
    const headers = [];
    for (let name in this.rows[0]) {
      headers.push({prop: name});
    }
    this.headers = headers;
  }

}
