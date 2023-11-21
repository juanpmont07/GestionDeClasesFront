import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clase } from '@core/modelo/clase';

@Component({
  selector: 'app-card-clase',
  templateUrl: './card-clase.component.html',
  styleUrls: ['./card-clase.component.scss'],
})
export class CardClaseComponent {
  @Input() clase: Clase = null;
  @Output() seleccionoClase = new EventEmitter<Clase>();
  constructor() {}

  toggleSeleccionClase() {
    this.seleccionoClase.emit(this.clase);
  }
}
