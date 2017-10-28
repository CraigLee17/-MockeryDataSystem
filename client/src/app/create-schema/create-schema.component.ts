import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
import {DataType} from "../_models/data.type";
import {SchemaService} from "../_service/schema.service";
import {Router} from "@angular/router";
import {SessionService} from "../_service/session.service";

import 'brace';
import 'brace/theme/tomorrow';


@Component({
  selector: 'app-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.css']
})
export class CreateSchemaComponent implements OnInit {
  private dataTypes = {};
  private createSchemaForm: FormGroup;
  private selectedIndex;
  private textfield = '';
  private category = ["address", "company", "date", "finance", "internet", "name", "phone", "random", "system"];


  constructor(private sessionService: SessionService,
              private fb: FormBuilder, private dataTypeService: DataTypeService,
              private schemaService: SchemaService, private router: Router) {
    this.dataTypeService.getAllDataTypes().subscribe(dataTypes => this.categorizeTypes(dataTypes));
  }

  categorizeTypes(dataTypes) {
    for (let index in this.category) {
      var kind = this.category[index];
      this.dataTypes[kind] = dataTypes.filter(type => type.name.startsWith(kind)).map(
        type => {
          type.name = type.name.substring(type.name.indexOf('.') + 1).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return type;
        });
    }
  }

  ngOnInit() {
    this.createSchemaForm = this.buildForm();
  }

  buildField() {
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    const lastOne = <FormGroup>fields.controls[fields.length - 1];
    return this.fb.group(lastOne.controls);
  }

  buildFields() {
    return this.fb.array([
      this.fb.group({
        name: ['firstName', Validators.required],
        dataType: this.fb.group({
          name: ['firstName', Validators.required],
          _id: ['59eabbc83bb4472dcc1f6c1a', Validators.required]
        }),
        option: ''
      }),
      this.fb.group({
        name: ['lastName', Validators.required],
        dataType: this.fb.group({
          name: ['lastName', Validators.required],
          _id: ['59eabbc83bb4472dcc1f6c1b', Validators.required]
        }),
        option: ''
      }),
      this.fb.group({
        name: ['email', Validators.required],
        dataType: this.fb.group({
          name: ['email', Validators.required],
          _id: ['59eabbc83bb4472dcc1f6c12', Validators.required]
        }),
        option: ''
      }),
      this.fb.group({
        name: ['country', Validators.required],
        dataType: this.fb.group({
          name: ['country', Validators.required],
          _id: ['59eabbc83bb4472dcc1f6bf8', Validators.required]
        }),
        option: ''
      }),
      this.fb.group({
        name: ['date', Validators.required],
        dataType: this.fb.group({
          name: ['past', Validators.required],
          _id: ['59eabbc83bb4472dcc1f6c02', Validators.required]
        }),
        option: ''
      })
    ])
  }

  buildForm() {
    return this.fb.group({
      name: ['', Validators.required],
      count: ['', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]],
      fileFormat: ['', Validators.required],
      fields: this.buildFields()
    });
  }

  removeField(index) {
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    if (fields.length == 1) {
      alert("The schema should have one field at least!");
    } else {
      fields.removeAt(index);
    }
  }

  addField() {
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    fields.push(this.buildField());
  }

  applyOption() {
    if (this.textfield != '') {
      const fields = <FormArray>this.createSchemaForm.controls['fields'];
      fields.controls[this.selectedIndex].patchValue({option: this.textfield});
    }
  }

  selectType(type: DataType) {
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    fields.controls[this.selectedIndex].patchValue({dataType: type});
  }

  fillTextfield(index) {
    this.selectedIndex = index;
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    this.textfield = fields.controls[index].value.option;
  }

  createSchema(newSchema) {
    this.schemaService.create(newSchema).subscribe(
      data => {
        this.router.navigate(['/user', this.sessionService.getUser().id, 'schemas']);
      },
      error => {
        console.log(error);
      });
  }
}
