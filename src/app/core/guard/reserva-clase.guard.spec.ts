import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { ReservaClaseGuard } from './reserva-clase.guard';

describe('ReservaClaseGuard', () => {
  let guard: ReservaClaseGuard;
  const mockSeleccionEstudianteService = jasmine.createSpyObj(
    'SeleccionEstudianteServiceService',
    ['getEstudianteSeleccionado'],
  );
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservaClaseGuard,
        {
          provide: SeleccionEstudianteServiceService,
          useValue: mockSeleccionEstudianteService,
        },
        { provide: Router, useValue: mockRouter },
      ],
    });
    guard = TestBed.inject(ReservaClaseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if estudiante is selected', (done) => {
    mockSeleccionEstudianteService.getEstudianteSeleccionado.and.returnValue(
      of({ id: 1, nombre: 'Test' }),
    );
    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should navigate to /estudiante and return false if no estudiante is selected', (done) => {
    mockSeleccionEstudianteService.getEstudianteSeleccionado.and.returnValue(
      of(null),
    );
    guard.canActivate().subscribe((result) => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/estudiante']);
      expect(result).toBe(false);
      done();
    });
  });
});
