import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmedPassword: new FormControl('', Validators.compose([Validators.required]))
    }, this.formGroupValidator);

  }

  formGroupValidator(formGroup: FormGroup) {
    let res = {pswNotMatch: false, allDirty: true};
    if (formGroup.controls['password'].value != formGroup.controls['confirmedPassword'].value) {
      res.pswNotMatch = true;
    }
    for (let key in formGroup.controls) {
      if (!formGroup.controls[key].dirty) {
        res.allDirty = false;
        break;
      }
    }
    return res;
  }
}
