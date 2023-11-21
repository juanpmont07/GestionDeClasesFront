import { TestBed } from '@angular/core/testing';

import { EstudianteService } from './estudiante.service';
import { Estudiante, NivelDeIngles } from '@core/modelo/estudiante';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpService } from '@core/services/http.service';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstudianteService, HttpService]
    });
    service = TestBed.inject(EstudianteService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should retrieve estudiantes from API via GET', () => {
    const mockEstudiantes: Estudiante[] = [
      {
        id: 1,
        nivelDeIngles: NivelDeIngles.Avanzado,
        nombre: 'Jose',
        saldo: 1000
      },
      {
        id: 2,
        nivelDeIngles: NivelDeIngles.Avanzado,
        nombre: 'Jose',
        saldo: 2000
      },
    ];

    service.consultar().subscribe((estudiantes: Estudiante[]) => {
      expect(estudiantes.length).toBe(2);
      expect(estudiantes).toEqual(mockEstudiantes);
    });

    const req = httpMock.expectOne(`${environment.endpoint}/estudiante`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEstudiantes);
  });

});
