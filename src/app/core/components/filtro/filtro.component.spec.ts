import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroComponent } from './filtro.component';
import { TipoClase } from '@core/modelo/clase';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from '@shared/module/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('FiltroComponent', () => {
  let component: FiltroComponent;
  let fixture: ComponentFixture<FiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,
      ],
      declarations: [FiltroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit actualizarFecha event on lafechaCambio', () => {
    spyOn(component.actualizarFecha, 'emit');
    const date = new Date();
    component.lafechaCambio(date);
    expect(component.actualizarFecha.emit).toHaveBeenCalledWith(date);
  });

  it('should emit tipoClaseCambio event on aplicarFiltroTipoClase', () => {
    spyOn(component.tipoClaseCambio, 'emit');
    const tipoSeleccionado = TipoClase.Grupal;
    component.aplicarFiltroTipoClase(tipoSeleccionado);
    expect(component.tipoClaseCambio.emit).toHaveBeenCalledWith(
      tipoSeleccionado,
    );
  });

  it('should emit limpiar event on limpiarFiltro', () => {
    component.fechaFiltro = new Date();
    component.limpiarFiltro();
    expect(component.fechaFiltro).toBe(null);
  });
});
