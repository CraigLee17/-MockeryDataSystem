import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RoutingModule} from './routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AuthenticationService} from './_service/authentication.service';
import {UserService} from "./_service/user.service";
import {SessionService} from "./_service/session.service";

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [AuthenticationService, UserService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
