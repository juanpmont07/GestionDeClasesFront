import { NgModule } from '@angular/core';

import { ClasesRoutingModule } from './clases-routing.module';
import { ClasesComponent } from './components/clases/clases.component';
import { SharedModule } from '@shared/shared.module';
import { ClasesService } from './shared/service/clases.service';
import { ReservarClaseComponent } from './components/reservar-clase/reservar-clase.component';
import { MaterialModule } from '@shared/module/material.module';
import { PersonalizarPaginadorIntl } from '@shared/module/personalizar-paginador';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CoreModule } from '@core/core.module';
import { CardClaseComponent } from './components/card-clase/card-clase.component';
import { ClasesReservadasComponent } from './components/clases-reservadas/clases-reservadas.component';


@NgModule({
  declarations: [
    ClasesComponent,
    ReservarClaseComponent,
    CardClaseComponent,
    ClasesReservadasComponent
  ],
  imports: [
    ClasesRoutingModule,
    SharedModule,
    CoreModule,
    MaterialModule
  ],
  providers: [
    ClasesService,
    { provide: MatPaginatorIntl, useClass: PersonalizarPaginadorIntl },
  ]
})
export class ClasesModule { }
