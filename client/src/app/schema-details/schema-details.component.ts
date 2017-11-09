import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchemaService} from "../_service/schema.service";
import {Schema} from "../_models/schema";
import {MockData} from "../_models/mock.data";

@Component({
  selector: 'app-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.css']
})
export class SchemaDetailsComponent implements OnInit {
  schema: Schema;
  previewData;
  userid: string;
  previewError;
  schemaError;

  constructor(private route: ActivatedRoute, private schemaService: SchemaService) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.userid = params['userid'];
      this.schemaService.getSchemaById(id).subscribe(
        schema => this.schema = schema,
        error => console.log(error)
      );
    });
  }

  ngOnInit() {
  }

  preview() {
    this.schemaService.previewBySchemaId(this.schema.id).subscribe(
      mockData => {
        this.previewData = mockData.data;
        this.previewError = null;
      },
      error => this.previewError = error.error.text
    )
  }

  generate() {
    this.schemaService.generate(this.schema.id).subscribe(
      data => console.log(data),
      error => this.schemaError = error.error.text
    )
  }
}
