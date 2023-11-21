import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ClaseReservada } from '@clases/shared/model/claseReservada';
import { ClasesService } from '@clases/shared/service/clases.service';
import { Estudiante, NivelDeIngles } from '@core/modelo/estudiante';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { ClasesReservadasComponent } from './clases-reservadas.component';
import { TipoClase } from '@core/modelo/clase';
import { HttpService } from '@core/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '@shared/module/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiltroComponent } from '@core/components/filtro/filtro.component';

describe('ClasesReservadasComponent', () => {
  let component: ClasesReservadasComponent;
  let fixture: ComponentFixture<ClasesReservadasComponent>;
  let estudianteService: SeleccionEstudianteServiceService;
  let claseService: ClasesService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasesReservadasComponent, FiltroComponent],
      imports: [HttpClientTestingModule, MaterialModule, FormsModule, CommonModule],
      providers: [
        SeleccionEstudianteServiceService,
        ClasesService,
        HttpService,
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open']),
        },
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClasesReservadasComponent);
    component = fixture.componentInstance;
    estudianteService = TestBed.inject(SeleccionEstudianteServiceService);
    claseService = TestBed.inject(ClasesService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reserved classes on init', () => {
    const estudiante: Estudiante = {
      id: 1,
      nivelDeIngles: NivelDeIngles.Principiante,
      nombre: 'Juan Pablo',
      saldo: 100,
    };
    const clasesReservadas: ClaseReservada[] = [
      {
        duracion: '1 hora',
        fechaInicio: new Date('2022-01-01T09:00:00'),
        id: 1,
        idReserva: 1,
        nombreProfesor: 'John Doe',
        tipoClase: TipoClase.Grupal,
      },
    ];
    spyOn(estudianteService, 'getEstudianteSeleccionado').and.returnValue(
      of(estudiante),
    );
    spyOn(claseService, 'consultarClasesReservadas').and.returnValue(
      of(clasesReservadas),
    );
    component.ngOnInit();

    expect(component.estudianteSeleccionado).toEqual(estudiante);
    expect(component.dataSource.data).toEqual(clasesReservadas);
  });

  it('should open confirmation modal and cancel reservation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of(true),
      close: null,
    });
    dialogRefSpyObj.componentInstance = { body: '' };
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);
    const claseReservada: ClaseReservada = {
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      idReserva: 1,
      nombreProfesor: 'John Doe',
      tipoClase: TipoClase.Grupal,
    };
    const spyClase = spyOn(claseService, 'cancelarClase').and.returnValue(of());

    component.abrirModalConfirmacion(claseReservada);

    expect(dialog.open).toHaveBeenCalled();
    expect(spyClase).toHaveBeenCalledWith(claseReservada.idReserva);
  });

  it('should show error message when cancel reservation fails', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of(true),
      close: null,
    });
    dialogRefSpyObj.componentInstance = { body: '' };
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpyObj);
    const spyClaseCancelar = spyOn(
      claseService,
      'cancelarClase',
    ).and.returnValue(of());

    const claseReservada: ClaseReservada = {
      duracion: '1 hora',
      fechaInicio: new Date('2022-01-01T09:00:00'),
      id: 1,
      idReserva: 1,
      nombreProfesor: 'John Doe',
      tipoClase: TipoClase.Grupal,
    };

    component.abrirModalConfirmacion(claseReservada);

    expect(dialog.open).toHaveBeenCalled();
    expect(spyClaseCancelar).toHaveBeenCalledWith(claseReservada.idReserva);
  });

  it('should apply class type filter', () => {
    const tipoClase = 'A';
    component.aplicarFiltroTipoClase(tipoClase);
    expect(component.dataSource.filter).toEqual(tipoClase);
  });

});
