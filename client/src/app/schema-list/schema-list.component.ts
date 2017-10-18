import {Component, OnInit} from '@angular/core';
import {SchemaService} from "../_service/schema.service";
import {Schema} from "../_models/schema";
import {SessionService} from "../_service/session.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.css']
})
export class SchemaListComponent implements OnInit {
  private schemas: [Schema];

  constructor(private route: ActivatedRoute, private schemaService: SchemaService, private sessionService : SessionService) {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (!id) {
        id = sessionService.getUser().id;
      }
      schemaService.getSchemasByUserId(id).subscribe(schemas => this.schemas = schemas);
    });
  }

  ngOnInit() {
  }

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
