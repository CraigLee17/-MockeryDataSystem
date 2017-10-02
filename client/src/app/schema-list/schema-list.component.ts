import {Component, OnInit} from '@angular/core';
import {SchemaService} from "../_service/schema.service";
import {Schema} from "../_models/schema";

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.css']
})
export class SchemaListComponent implements OnInit {
  private schemas: [Schema];

  /*schemas = [{
    name: 'schema1',
    fields : [{
      name: 'boolean'
    }, {
      name: 'email'
    }, {
      name: 'gender'
    }]
  }];*/

  constructor(private schemaService: SchemaService) {
    schemaService.getSchemasByUserId().subscribe(schemas => this.schemas = schemas);
  }

  ngOnInit() {
  }

}
