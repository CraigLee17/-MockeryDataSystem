import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {DataType} from "../_models/data.type";

@Component({
  selector: 'app-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.css']
})
export class CreateSchemaComponent implements OnInit {
  private dataTypes: DataType[];

  constructor(private dataTypeService: DataTypeService) {
    dataTypeService.getAllDataTypes().subscribe(dataTypes => this.dataTypes = dataTypes);
  }

  ngOnInit() {
  }

}
