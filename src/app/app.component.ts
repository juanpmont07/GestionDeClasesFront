import { Component } from '@angular/core';
import { MenuItem } from '@core/modelo/menu-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app-base';
  public companies: MenuItem[] = [
    { url: '/estudiante', nombre: 'home' },
    { url: '/clases/reserva/disponibles', nombre: 'Reservar' },
    { url: '/clases/reserva/reservadas', nombre: 'Clases reservadas' },
  ];
}
