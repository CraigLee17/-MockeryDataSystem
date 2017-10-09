import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {DataType} from "../_models/data.type";
import {SchemaService} from "../_service/schema.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.css']
})
export class CreateSchemaComponent implements OnInit {
  private dataTypes: DataType[];
  /*dataTypes = [
    {
      name: 'boolean',
      description: 'this is boolean'
    }, {
      name: 'number',
      description: 'this is number'
    }, {
      name: 'email',
      description: 'this is email'
    }, {
      name: 'gender',
      description: 'this is gender'
    }, {
      name: 'postcode',
      description: 'this is postcode'
    }, {
      name: 'country',
      description: 'this is country'
    }
  ];*/
  initialFields = [
    new FormControl({name: 'id', dataType: {name: 'row'}}),
    new FormControl({name: 'email', dataType: {name: 'email'}}),
    new FormControl({name: 'name', dataType: {name: 'name'}}),
    new FormControl({name: 'country', dataType: {name: 'country'}}),
    new FormControl({name: 'gender', dataType: {name: 'gender'}}),
  ];

  createSchemaForm: FormGroup;
  name = new FormControl('', Validators.required);
  count = new FormControl('', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]);
  fields = new FormArray(this.initialFields);
  fileFormat = new FormControl('', Validators.required);

  selectedIndex;

  constructor(private dataTypeService: DataTypeService, private schemaService: SchemaService, private router: Router) {
    dataTypeService.getAllDataTypes().subscribe(dataTypes => this.dataTypes = dataTypes);
  }

  ngOnInit() {
    this.createSchemaForm = new FormGroup({
      name: this.name,
      count: this.count,
      fields: this.fields,
      fileFormat: this.fileFormat
    });
  }

  removeField(index) {
    this.fields.removeAt(index);
  }

  addField() {
    this.fields.push(new FormControl({name: '', type: {name: '', description: ''}}));
  }

  selectType(type: DataType) {
    this.fields.controls[this.selectedIndex].value.dataType = type;
  }

  createSchema(newSchema) {
    this.schemaService.create(newSchema).subscribe(
      data => {
        this.router.navigate(['/schemas']);
      },
      error => {
        console.log(error);
      });
  }

}
