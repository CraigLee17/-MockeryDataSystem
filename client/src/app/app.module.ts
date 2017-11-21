import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RoutingModule} from './routing.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

import {AuthenticationService} from './_service/authentication.service';
import {UserService} from "./_service/user.service";
import {SessionService} from "./_service/session.service";
import {DataTypeService} from "./_service/data.type.service";
import {VisitorService} from "./_service/visitor.service";

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {LogoutComponent} from './logout/logout.component';
import {SchemaListComponent} from './schema-list/schema-list.component';
import {CreateSchemaComponent} from './create-schema/create-schema.component';
import {SchemaService} from "./_service/schema.service";
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {SchemaDetailsComponent} from './schema-details/schema-details.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {UsersComponent} from './users/users.component';
import {UserDetailsComponent} from './user-details/user-details.component';
import {UpdateSchemaComponent} from './update-schema/update-schema.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    SchemaListComponent,
    CreateSchemaComponent,
    SchemaDetailsComponent,
    NotFoundComponent,
    UsersComponent,
    UserDetailsComponent,
    UpdateSchemaComponent
  ],
  imports: [
    AceEditorModule,
    BrowserModule,
    RoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    // attach csrf token to post and put request
    HttpClientXsrfModule.withOptions({
      headerName: 'csrf-token',
      cookieName: 'csrf-token'
    }),
    NgxDatatableModule
  ],
  providers: [AuthenticationService, UserService, SessionService, DataTypeService, SchemaService, VisitorService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
