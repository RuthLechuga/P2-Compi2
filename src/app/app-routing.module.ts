import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IDEComponent } from './components/ide/ide.component';


const routes: Routes = [
  { 
    path: '', 
    component: IDEComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
