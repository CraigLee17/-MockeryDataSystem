import {FormBuilder, Validators} from "@angular/forms";

export class Field {
  constructor(private fieldName, private dateTypeName, private _id, private option, private fb: FormBuilder) {
  }

  buildField() {
    return this.fb.group({
      name: [this.fieldName, Validators.required],
      dataType: this.fb.group({
        name: [this.dateTypeName, Validators.required],
        _id: [this._id, Validators.required]
      }),
      option: this.option
    })
  }
}
