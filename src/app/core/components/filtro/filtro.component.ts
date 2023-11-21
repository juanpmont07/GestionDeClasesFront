import { Component, EventEmitter, Output } from '@angular/core';
import { TipoClase } from '@core/modelo/clase';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent {
  @Output() tipoClaseCambio = new EventEmitter<string>();
  @Output() limpiar = new EventEmitter();
  @Output() actualizarFecha = new EventEmitter<Date>();

  fechaFiltro: Date;
  tipoClaseFiltro: TipoClase | null = null;
  tiposClase = Object.values(TipoClase) as string[];

  constructor() {}

  lafechaCambio(date: Date) {
    this.actualizarFecha.emit(date);
  }

  limpiarFiltro(): void {
    this.fechaFiltro = null;
    this.tipoClaseFiltro = null;
    this.limpiar.emit();
  }

  aplicarFiltroTipoClase(tipoSeleccionado: string | null): void {
    this.tipoClaseCambio.emit(tipoSeleccionado || '');
  }

  fechaMinima(): Date {
    return new Date();
  }
}
