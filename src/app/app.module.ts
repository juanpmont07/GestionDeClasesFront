import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from '@home/home.component';
import { ClasesModule } from '@clases/clases.module';
import { CoreModule } from '@core/core.module';
import { CookieService } from 'ngx-cookie-service';
import { EstudianteModule } from '@estudiante/estudiante.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@shared/module/material.module';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClasesModule,
    CoreModule,
    EstudianteModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [CookieService, SeleccionEstudianteServiceService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
