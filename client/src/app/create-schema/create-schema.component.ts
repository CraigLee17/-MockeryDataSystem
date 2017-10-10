import {Component, OnInit} from '@angular/core';
import {DataTypeService} from "../_service/data.type.service";
import {FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
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
  public createSchemaForm: FormGroup;
  public selectedIndex;

  /* initialFields = [
     new FormControl({name: 'id', dataType: {name: 'row', _id: "59d1b0269c4bfe411ce65c84"}}),
     new FormControl({name: 'email', dataType: {name: 'email', _id: "59d1b0269c4bfe411ce65c86"}}),
     new FormControl({name: 'name', dataType: {name: 'name', _id: "59d1b0269c4bfe411ce65c89"}}),
     new FormControl({name: 'country', dataType: {name: 'country', _id: "59d1b0269c4bfe411ce65c88"}}),
     new FormControl({name: 'gender', dataType: {name: 'gender', _id: "59d1b0269c4bfe411ce65c87"}}),
   ];*/

  constructor(private fb: FormBuilder, private dataTypeService: DataTypeService, private schemaService: SchemaService, private router: Router) {
    dataTypeService.getAllDataTypes().subscribe(dataTypes => this.dataTypes = dataTypes);
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
        name: ['id', Validators.required],
        dataType: this.fb.group({
          name: ['row', Validators.required],
          _id: ['59d1b0269c4bfe411ce65c84', Validators.required]
        })
      }),
      this.fb.group({
        name: ['email', Validators.required],
        dataType: this.fb.group({
          name: ['email', Validators.required],
          _id: ['59d1b0269c4bfe411ce65c86', Validators.required]
        })
      }),
      this.fb.group({
        name: ['name', Validators.required],
        dataType: this.fb.group({
          name: ['name', Validators.required],
          _id: ['59d1b0269c4bfe411ce65c89', Validators.required]
        })
      }),
      this.fb.group({
        name: ['country', Validators.required],
        dataType: this.fb.group({
          name: ['country', Validators.required],
          _id: ['59d1b0269c4bfe411ce65c88', Validators.required]
        })
      }),
      this.fb.group({
        name: ['gender', Validators.required],
        dataType: this.fb.group({
          name: ['gender', Validators.required],
          _id: ['59d1b0269c4bfe411ce65c87', Validators.required]
        })
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

  selectType(type: DataType) {
    const fields = <FormArray>this.createSchemaForm.controls['fields'];
    fields.controls[this.selectedIndex].patchValue({dataType: type});
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
