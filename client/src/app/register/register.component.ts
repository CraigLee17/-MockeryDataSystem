import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserService} from "../_service/index";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmedPassword: new FormControl('', Validators.required)
    }, this.formGroupValidator);
  }

  register(newUser) {
    delete newUser.confirmedPassword;
    this.userService.create(newUser)
      .subscribe(
        data => {
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
          this.error = error._body;
        });
  }

  formGroupValidator(formGroup: FormGroup) {
    let res = {pswNotMatch: false, clean: false};
    // check password equality
    if (formGroup.controls['password'].value != formGroup.controls['confirmedPassword'].value) {
      res.pswNotMatch = true;
    }
    // check if all inputs are dirty or not
    for (let key in formGroup.controls) {
      if (!formGroup.controls[key].dirty) {
        res.clean = true;
        break;
      }
    }
    return (!res.clean && !res.pswNotMatch) ? null : res;
  }
}
