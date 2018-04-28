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
  schemas: [Schema];
  private id;

  constructor(private route: ActivatedRoute, private schemaService: SchemaService, public sessionService: SessionService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (!this.id) {
        this.id = sessionService.getUser().id;
      }
      schemaService.getSchemasByUserId(this.id).subscribe(schemas => this.schemas = schemas);
    });
  }

  ngOnInit() {
  }

  deleteSchema(index) {
    if (this.sessionService.getUser().id != this.schemas[index].user) {
      alert("You can't delete the schema since you don't own this schema!");
    } else {
      if (confirm("Are you sure to delete this schema? Related mock data will be removed!")) {
        this.schemaService.remove(this.schemas[index].id)
          .subscribe(
            msg => console.log(msg),
            error => console.log(error)
          );
        this.schemas.splice(index, 1);
      }
    }
  }
}
