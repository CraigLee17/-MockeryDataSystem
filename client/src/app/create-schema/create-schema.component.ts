import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
import {DataType} from "../_models/data.type";
import {SchemaService} from "../_service/schema.service";
import {Router} from "@angular/router";
import {SessionService} from "../_service/session.service";

import 'brace';
import 'brace/theme/tomorrow';
import {Field} from "../_models/field";


@Component({
  selector: 'app-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.css']
})
export class CreateSchemaComponent implements OnInit {
  dataTypes = {};
  createSchemaForm: FormGroup;
  selectedIndex;
  textfield = '';
  category = ["address", "company", "date", "finance", "internet", "name", "phone", "random", "system"];
  schemaError;


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
    const fields = [{
      name: 'firstName',
      dataType: {
        name: 'firstName',
        _id: '59eabbc83bb4472dcc1f6c1a'
      },
      option: '',
      blank: 0
    }, {
      name: 'lastName',
      dataType: {
        name: 'lastName',
        _id: '59eabbc83bb4472dcc1f6c1b'
      },
      option: '',
      blank: 0
    }, {
      name: 'email',
      dataType: {
        name: 'email',
        _id: '59eabbc83bb4472dcc1f6c12'
      },
      option: '',
      blank: 0
    }, {
      name: 'country',
      dataType: {
        name: 'country',
        _id: '59eabbc83bb4472dcc1f6bf8'
      },
      option: '',
      blank: 0
    }, {
      name: 'date',
      dataType: {
        name: 'past',
        _id: '59eabbc83bb4472dcc1f6c02'
      },
      option: '',
      blank: 0
    }];
    const fieldGroup = fields.map(
      field => new Field(field.name, field.dataType.name, field.dataType._id, field.option, field.blank, this.fb).buildField()
    );
    return this.fb.array(fieldGroup);
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
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    fields.controls[this.selectedIndex].patchValue({option: this.textfield});
    fields.controls[this.selectedIndex].patchValue({
      dataType: {
        _id: "5a2b5ca6bbeb612e307415f7",
        name: "self-defined"
      }
    });
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
    // Check if same name occurs in different column
    if (!this.checkFieldName(newSchema.fields)) return;
    this.schemaService.create(newSchema).subscribe(
      data => this.router.navigate(['/user', this.sessionService.getUser().id, 'schemas']),
      error => this.schemaError = error.error.text
    );
  }

  checkFieldName(fields) {
    const set = new Set();
    for (let i in fields) {
      if (set.has(fields[i].name)) {
        this.schemaError = "Different column cannot have the same name!";
        return false;
      }
      set.add(fields[i].name);
    }
    return true;
  }
}
