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


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'schemas', component: SchemaListComponent},
  {path: 'schemas/new', component: CreateSchemaComponent},
  {path: 'schemas/:id', component: SchemaDetailsComponent},
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
