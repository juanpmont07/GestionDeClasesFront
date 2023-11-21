import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ClasesService } from './clases.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Clase, NivelIngles, TipoClase } from '@core/modelo/clase';
import { ClaseReservada } from '../model/claseReservada';
import { ReservarClaseDTO } from '../model/reservarClaseDTO';

describe('ClasesService', () => {
  let httpTestingController: HttpTestingController;
  let service: ClasesService;

  beforeEach(() => {
    const injector = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClasesService, HttpService],
    });
    httpTestingController = injector.inject(HttpTestingController);
    service = TestBed.inject(ClasesService);
  });

  it('should be created', () => {
    const productService: ClasesService = TestBed.inject(ClasesService);
    expect(productService).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch available classes', () => {
    const nivelIngles = 'intermediate';
    const idEstudiante = 1;
    const mockResponse: Clase[] = [
      {
        capacidadMaxima: 10,
        duracion: '1 hora',
        fechaInicio: new Date('2022-01-01T09:00:00'),
        id: 1,
        nivelIngles: NivelIngles.Intermedio,
        nombreProfesor: 'John Doe',
        ocupacionActual: 5,
        precio: 100,
        tipoClase: TipoClase.Grupal,
        seleccionada: false,
      },
    ];
    service
      .consultarClasesDisponibles(nivelIngles, idEstudiante)
      .subscribe((clases) => {
        expect(clases).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.endpoint}/clases/${nivelIngles}/${idEstudiante}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch reserved classes', () => {
    const idEstudiante = 1;
    const mockResponse: ClaseReservada[] = [
      {
        duracion: '1 hora',
        fechaInicio: new Date('2022-01-01T09:00:00'),
        id: 1,
        idReserva: 1,
        nombreProfesor: 'John Doe',
        tipoClase: TipoClase.Grupal,
      },
    ];

    service.consultarClasesReservadas(idEstudiante).subscribe((clases) => {
      expect(clases).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.endpoint}/clases/reservada/${idEstudiante}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should reserve classes', () => {
    const mockDTO: ReservarClaseDTO = {
      idEstudiante: 1,
      idsClases: [2],
      tipoClase: 'PARTICULAR',
    };

    service.reservarClases(mockDTO).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(
      `${environment.endpoint}/reserva`,
    );
    expect(req.request.method).toBe('POST');
    req.flush(null); // Change this based on expected response
  });

  it('should cancel a class reservation', () => {
    const idClaseReserva = 1;

    service.cancelarClase(idClaseReserva).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      `${environment.endpoint}/reserva/cancelar/${idClaseReserva}`,
    );
    expect(req.request.method).toBe('POST');
    req.flush(true); // Change this based on expected response
  });
});
