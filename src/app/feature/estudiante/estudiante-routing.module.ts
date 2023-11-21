import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaEstudianteComponent } from './lista-estudiante/lista-estudiante.component';

const routes: Routes = [
  {
    path: '',
    component: ListaEstudianteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule { }
