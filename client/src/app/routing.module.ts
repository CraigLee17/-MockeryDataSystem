import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from "./logout/logout.component";
import {HomeComponent} from "./home/home.component";
import {SchemaListComponent} from "./schema-list/schema-list.component";
import {CreateSchemaComponent} from "./create-schema/create-schema.component";
import {SchemaDetailsComponent} from "./schema-details/schema-details.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {UsersComponent} from "./users/users.component";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {UpdateSchemaComponent} from "./update-schema/update-schema.component";
import {ProfileComponent} from "./profile/profile.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'user/:id/schemas', component: SchemaListComponent},
  {path: 'schemas', component: SchemaListComponent},
  {path: 'schemas/new', component: CreateSchemaComponent},
  {path: 'schemas/:id/update', component: UpdateSchemaComponent},
  {path: 'users/:userid/schemas/:id', component: SchemaDetailsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: UserDetailsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'notfound', component: NotFoundComponent},
  // otherwise redirect to not found
  {path: '**', redirectTo: 'notfound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingModule {
}
