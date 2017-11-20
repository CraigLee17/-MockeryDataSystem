import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
import {DataType} from "../_models/data.type";
import {SchemaService} from "../_service/schema.service";
import {ActivatedRoute, Router} from "@angular/router";

import 'brace';
import 'brace/theme/tomorrow';
import {Schema} from "../_models/schema";
import {Field} from "../_models/field";
import {SessionService} from "../_service/session.service";

@Component({
  selector: 'app-update-schema',
  templateUrl: './update-schema.component.html',
  styleUrls: ['./update-schema.component.css']
})
export class UpdateSchemaComponent implements OnInit {

  dataTypes = {};
  updateSchemaForm: FormGroup;
  selectedIndex;
  textfield = '';
  category = ["address", "company", "date", "finance", "internet", "name", "phone", "random", "system"];
  schema: Schema;
  schemaError;

  constructor(private fb: FormBuilder,
              private dataTypeService: DataTypeService,
              private sessionService: SessionService,
              private schemaService: SchemaService,
              private route: ActivatedRoute,
              private router: Router) {
    this.dataTypeService.getAllDataTypes().subscribe(dataTypes => this.categorizeTypes(dataTypes));
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.schemaService.getSchemaById(id).subscribe(
        schema => {
          this.schema = schema;
          this.updateSchemaForm = this.buildForm();
        },
        error => console.log(error)
      );
    });
  }

  ngOnInit() {
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

  buildField() {
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    const lastOne = <FormGroup>fields.controls[fields.length - 1];
    return this.fb.group(lastOne.controls);
  }

  buildFields() {
    const fields = this.schema.fields.map(
      field => new Field(field.name, field.dataType.name, field.dataType._id, field.option, this.fb).buildField()
    );
    return this.fb.array(fields);
  }

  buildForm() {
    return this.fb.group({
      name: [this.schema.name, Validators.required],
      count: [this.schema.count, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]],
      fileFormat: [this.schema.fileFormat, Validators.required],
      fields: this.buildFields()
    });
  }

  removeField(index) {
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    if (fields.length == 1) {
      alert("The schema should have one field at least!");
    } else {
      fields.removeAt(index);
    }
  }

  addField() {
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    fields.push(this.buildField());
  }

  applyOption() {
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    fields.controls[this.selectedIndex].patchValue({option: this.textfield});
  }

  selectType(type: DataType) {
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    fields.controls[this.selectedIndex].patchValue({dataType: type});
  }

  fillTextfield(index) {
    this.selectedIndex = index;
    const fields = <FormArray>this.updateSchemaForm.controls['fields'];
    this.textfield = fields.controls[index].value.option;
  }

  updateSchema(updateSchema) {
    if (confirm("Are you sure to change it? Mock data related with this old schema will be removed!")) {
      // Check if same name occurs in different column
      if (!this.checkFieldName(updateSchema.fields)) return;
      updateSchema.id = this.schema.id;
      this.schemaService.update(updateSchema).subscribe(
        schema => this.router.navigate(['/users', this.sessionService.getUser().id, 'schemas', this.schema.id]),
        error => this.schemaError = error.error.text
      );
    }
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
