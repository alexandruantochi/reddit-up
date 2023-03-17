import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import {StartComponent} from "./components/start/start.component";

const routes: Routes = [
  { path: 'user/:username', component: UserPageComponent },
  { path: '**', component: StartComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
