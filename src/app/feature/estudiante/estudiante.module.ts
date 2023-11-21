import { NgModule } from '@angular/core';

import { EstudianteRoutingModule } from './estudiante-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ListaEstudianteComponent } from './lista-estudiante/lista-estudiante.component';
import { EstudianteService } from './shared/service/estudiante.service';
import { MaterialModule } from '@shared/module/material.module';


@NgModule({
  declarations: [
    ListaEstudianteComponent
  ],
  imports: [
    EstudianteRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [EstudianteService],

})
export class EstudianteModule { }
