import {FormBuilder, Validators} from "@angular/forms";

export class Field {
  constructor(private fieldName, private dateTypeName, private _id, private option, private blank, private fb: FormBuilder) {
  }

  buildField() {
    return this.fb.group({
      name: [this.fieldName, Validators.required],
      dataType: this.fb.group({
        name: [this.dateTypeName, Validators.required],
        _id: [this._id, Validators.required]
      }),
      option: this.option,
      blank: [this.blank, [Validators.required, Validators.pattern('^([0-9]|([1-9][0-9])|100)$')]]
    })
  }
}
