import { TestBed } from '@angular/core/testing';
import { SeleccionEstudianteServiceService } from './seleccion-estudiante-service.service';
import { Estudiante, NivelDeIngles } from '@core/modelo/estudiante';

describe('SeleccionEstudianteServiceService', () => {
  let service: SeleccionEstudianteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeleccionEstudianteServiceService],
    });
    service = TestBed.inject(SeleccionEstudianteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit and retrieve selected student', (done: DoneFn) => {
    const mockEstudiante: Estudiante = {
      id: 1,
      nombre: 'John Doe',
      nivelDeIngles: NivelDeIngles.Avanzado,
      saldo: 100,
    };
    service.seleccionarEstudiante(mockEstudiante);

    service.getEstudianteSeleccionado().subscribe((estudiante) => {
      expect(estudiante).toEqual(mockEstudiante);
      done();
    });
  });

  it('should emit and retrieve null for unselected student', (done: DoneFn) => {
    service.getEstudianteSeleccionado().subscribe((estudiante) => {
      expect(estudiante).toBeNull();
      done();
    });
  });
});
