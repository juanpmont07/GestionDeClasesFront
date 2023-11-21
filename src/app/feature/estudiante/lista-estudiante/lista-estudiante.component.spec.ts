import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EstudianteService } from '@estudiante/shared/service/estudiante.service';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { ListaEstudianteComponent } from './lista-estudiante.component';
import { Estudiante, NivelDeIngles } from '@core/modelo/estudiante';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ListaEstudianteComponent', () => {
  let component: ListaEstudianteComponent;
  let fixture: ComponentFixture<ListaEstudianteComponent>;
  let estudianteService: EstudianteService;
  let seleccionEstudianteService: SeleccionEstudianteServiceService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaEstudianteComponent],
      providers: [
        {
          provide: EstudianteService,
          useValue: jasmine.createSpyObj('EstudianteService', ['consultar']),
        },
        {
          provide: SeleccionEstudianteServiceService,
          useValue: jasmine.createSpyObj('SeleccionEstudianteServiceService', [
            'seleccionarEstudiante',
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEstudianteComponent);
    component = fixture.componentInstance;
    estudianteService = TestBed.inject(EstudianteService);
    seleccionEstudianteService = TestBed.inject(
      SeleccionEstudianteServiceService,
    );
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    const estudiantes: Estudiante[] = [
      {
        id: 1,
        nivelDeIngles: NivelDeIngles.Principiante,
        nombre: 'Juan Pablo',
        saldo: 100,
      },
    ];
    (estudianteService.consultar as jasmine.Spy).and.returnValue(
      of(estudiantes),
    );

    component.ngOnInit();

    expect(component.estudiantes).toEqual(estudiantes);
  });

  it('should select student and navigate to available classes', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };

    component.seleccionarEstudiante(estudiante);

    expect(
      seleccionEstudianteService.seleccionarEstudiante,
    ).toHaveBeenCalledWith(estudiante);
    expect(router.navigate).toHaveBeenCalledWith([
      '/clases/reserva/disponibles',
    ]);
  });
});
