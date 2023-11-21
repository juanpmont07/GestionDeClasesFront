import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token-interceptor';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpService } from './services/http.service';
import { ManejadorError } from './interceptor/manejador-error';
import { RouterModule } from '@angular/router';
import { ReservaClaseGuard } from './guard/reserva-clase.guard';
import { FiltroComponent } from './components/filtro/filtro.component';
import { MaterialModule } from '@shared/module/material.module';
import { FormsModule } from '@angular/forms';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    FiltroComponent,
    ModalConfirmacionComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    FiltroComponent,
    ModalConfirmacionComponent,
  ],
  providers: [
    HttpService,
    ReservaClaseGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ManejadorError },
  ],
})
export class CoreModule {}
