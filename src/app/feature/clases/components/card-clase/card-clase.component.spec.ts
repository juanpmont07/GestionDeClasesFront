import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardClaseComponent } from './card-clase.component';
import { Clase, NivelIngles, TipoClase } from '@core/modelo/clase';

describe('CardClaseComponent', () => {
  let component: CardClaseComponent;
  let fixture: ComponentFixture<CardClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardClaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit seleccionoClase event on toggleSeleccionClase', () => {
    spyOn(component.seleccionoClase, 'emit');
    const clase: Clase = {
      capacidadMaxima: 20,
      duracion: '2 horas',
      fechaInicio: new Date('2022-01-01T10:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 10,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: false,
    };
    component.clase = clase;
    component.toggleSeleccionClase();
    expect(component.seleccionoClase.emit).toHaveBeenCalledWith(clase);
  });
});
