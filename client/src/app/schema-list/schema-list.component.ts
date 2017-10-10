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

  constructor(private schemaService: SchemaService) {
    schemaService.getSchemasByUserId().subscribe(schemas => this.schemas = schemas);
  }

  ngOnInit() {}

  deleteSchema(index) {
    if (confirm("Are you sure to delete this schema?")) {
      this.schemaService.remove(this.schemas[index].id)
        .subscribe(
          schema => console.log(schema),
          error => console.log(error)
        );
      this.schemas.splice(index, 1);
    }
  }
}
