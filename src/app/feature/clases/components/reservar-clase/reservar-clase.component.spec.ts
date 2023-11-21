import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservarClaseComponent } from './reservar-clase.component';
import { ClasesService } from '@clases/shared/service/clases.service';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Clase, NivelIngles, TipoClase } from '@core/modelo/clase';
import { Estudiante, NivelDeIngles } from '@core/modelo/estudiante';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from '@core/services/http.service';
import { MaterialModule } from '@shared/module/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiltroComponent } from '@core/components/filtro/filtro.component';

describe('ReservarClaseComponent', () => {
  let component: ReservarClaseComponent;
  let fixture: ComponentFixture<ReservarClaseComponent>;
  let claseService: ClasesService;
  let estudianteService: SeleccionEstudianteServiceService;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservarClaseComponent, FiltroComponent],
      imports: [HttpClientTestingModule, MaterialModule, FormsModule, CommonModule],
      providers: [
        ClasesService,
        SeleccionEstudianteServiceService,
        HttpService,
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarClaseComponent);
    component = fixture.componentInstance;
    claseService = TestBed.inject(ClasesService);
    estudianteService = TestBed.inject(SeleccionEstudianteServiceService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set student on init', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };

    spyOn(estudianteService, 'getEstudianteSeleccionado').and.returnValue(
      of(estudiante),
    );
    spyOn(claseService, 'consultarClasesDisponibles').and.returnValue(of([]));

    component.ngOnInit();

    expect(component.estudianteSeleccionado).toEqual(estudiante);
  });

  it('should get available classes on init', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };
    const clases: Clase[] = [
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
    spyOn(estudianteService, 'getEstudianteSeleccionado').and.returnValue(
      of(estudiante),
    );
    spyOn(claseService, 'consultarClasesDisponibles').and.returnValue(
      of(clases),
    );

    component.ngOnInit();

    expect(component.dataSource.data).toEqual(clases);
  });

  it('should reserve classes', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };
    const clases: Clase[] = [
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
      {
        capacidadMaxima: 10,
        duracion: '1 hora',
        fechaInicio: new Date('2022-01-01T09:00:00'),
        id: 2,
        nivelIngles: NivelIngles.Intermedio,
        nombreProfesor: 'John Doe',
        ocupacionActual: 5,
        precio: 100,
        tipoClase: TipoClase.Grupal,
        seleccionada: false,
      },
    ];
    component.estudianteSeleccionado = estudiante;
    component.clasesSeleccionadas = clases;
    const reservarSpy = spyOn(claseService, 'reservarClases').and.returnValue(
      of(null),
    );

    component.reservar();

    expect(reservarSpy).toHaveBeenCalledWith({
      idEstudiante: estudiante.id,
      idsClases: clases.map((clase) => clase.id),
      tipoClase: clases[0].tipoClase,
    });
    expect(snackBar.open).toHaveBeenCalledWith(
      component.MENSAJE_RESERVO_EXITOSAMENTE,
      'Cerrar',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );
    expect(router.navigate).toHaveBeenCalledWith([
      '/clases/reserva/reservadas',
    ]);
  });

  it('should not reserve classes if less than 2 selected', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };
    const clases: Clase[] = [
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

    component.estudianteSeleccionado = estudiante;
    component.clasesSeleccionadas = clases;

    component.reservar();

    expect(snackBar.open).toHaveBeenCalledWith(
      component.MENSAJE_ERROR_NO_TIENE_CLASES_SELECCIONADAS,
      'Cerrar',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should show message', () => {
    const mensaje = 'Test message';

    component.mostrarMensaje(mensaje);

    expect(snackBar.open).toHaveBeenCalledWith(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('should toggle class selection', () => {
    const clase: Clase = {
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
    };
    spyOn(component, 'puedeSeleccionarClase').and.returnValue(true);
    spyOn(component, 'actualizarClasesSeleccionadas');
    spyOn(component, 'actualizarDataSource');

    component.toggleSeleccionClase(clase);

    expect(clase.seleccionada).toBe(true);
    expect(component.actualizarClasesSeleccionadas).toHaveBeenCalledWith(clase);
    expect(component.actualizarDataSource).toHaveBeenCalledWith(clase);
  });

  it('should update selected classes', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.clasesSeleccionadas = [];
    component.saldoTotal = 0;

    component.actualizarClasesSeleccionadas(clase);

    expect(component.clasesSeleccionadas).toContain(clase);
    expect(component.saldoTotal).toBe(clase.precio);
  });

  it('should update balance', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.saldoTotal = 0;

    component.actualizarSaldo(clase, true);

    expect(component.saldoTotal).toBe(clase.precio);
  });

  it('should update data source', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.dataSource.data = [clase];

    component.actualizarDataSource(clase);

    expect(component.dataSource.data[0]).toBe(clase);
  });

 
  it('should apply date filter', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.dataSource.data = [clase];
    const fecha = new Date(2022, 0, 1); 
    component.aplicarFiltroFecha(fecha);

    expect(component.dataSource.filterPredicate(clase, '')).toBeTrue();

    clase.fechaInicio =  new Date('2021-12-31'); 

    expect(component.dataSource.filterPredicate(clase, '')).toBeFalse();
  });

  it('should remove selected class', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.clasesSeleccionadas = [clase];

    component.quitarClaseSeleccionada(0);

    expect(component.clasesSeleccionadas.length).toBe(0);
  });

  it('should not select class if not of the same type', () => {
    const claseA: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    const claseB: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 2,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'Jane Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Particular,
      seleccionada: false,
    };
    component.clasesSeleccionadas = [claseA];

    expect(component.puedeSeleccionarClase(claseB)).toBe(false);
  });

  it('should select class if of the same type', () => {
    const claseA: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    const claseB: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 2,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'Jane Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: false,
    };
    component.clasesSeleccionadas = [claseA];

    expect(component.puedeSeleccionarClase(claseB)).toBe(true);
  });

  it('should not add to balance if class is not selected', () => {
    const clase: Clase = {
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
    };
    component.saldoTotal = 100;

    component.actualizarSaldo(clase, false);

    expect(component.saldoTotal).toBe(0);
  });

  it('should toggle class selection', () => {
    const clase: Clase = {
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
    };

    component.toggleSeleccionClase(clase);

    expect(clase.seleccionada).toBe(true);
  });



  it('should apply class type filter', () => {
    const tipoSeleccionado = 'Grupal';

    component.aplicarFiltroTipoClase(tipoSeleccionado);

    expect(component.dataSource.filter).toBe(tipoSeleccionado);
  });

  it('should apply class type filter with null', () => {
    component.dataSource.filter = 'some filter';

    component.aplicarFiltroTipoClase(null);

    expect(component.dataSource.filter).toBe('');
  });


  it('should remove class from selected classes and update balance', () => {
    const clase: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    component.clasesSeleccionadas = [clase];
    component.saldoTotal = 100;

    spyOn(component, 'actualizarSaldo');

    clase.seleccionada = false;
    component.actualizarClasesSeleccionadas(clase);

    expect(component.clasesSeleccionadas).toEqual([]);
    expect(component.actualizarSaldo).toHaveBeenCalledWith(clase, false);
  });

  it('should not remove class from selected classes if not found', () => {
    const claseA: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'John Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: true,
    };
    const claseB: Clase = {
      capacidadMaxima: 10,
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 2,
      nivelIngles: NivelIngles.Intermedio,
      nombreProfesor: 'Jane Doe',
      ocupacionActual: 5,
      precio: 100,
      tipoClase: TipoClase.Grupal,
      seleccionada: false,
    };
    component.clasesSeleccionadas = [claseA];
    component.saldoTotal = 100;

    spyOn(component, 'actualizarSaldo');

    component.actualizarClasesSeleccionadas(claseB);

    expect(component.clasesSeleccionadas).toEqual([claseA]);
  });
});
