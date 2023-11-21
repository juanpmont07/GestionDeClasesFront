import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasesReservadasComponent } from './components/clases-reservadas/clases-reservadas.component';
import { ReservarClaseComponent } from './components/reservar-clase/reservar-clase.component';


const routes: Routes = [
  {
    path: 'reserva',
    children: [
      {
        path: 'disponibles',
        component: ReservarClaseComponent
      },
      {
        path: 'reservadas',
        component: ClasesReservadasComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasesRoutingModule { }
