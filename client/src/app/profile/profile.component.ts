import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserService} from "../_service/index";
import {SessionService} from "../_service/session.service";
import {User} from "../_models/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  error: String;
  psw: String;
  confirmedPsw: String;

  constructor(private userService: UserService, private sessionService: SessionService) {
  }

  ngOnInit() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.profileForm.patchValue(this.sessionService.getUser());
  }

  update(updateUser) {
    this.userService.updateUser(this.sessionService.getUser().id, updateUser)
      .subscribe(
        user => {
          this.sessionService.create(user);
          alert("Profile updated!");
        },
        error => {
          console.log(error);
          alert(error.error.text);
        });
  }
}
