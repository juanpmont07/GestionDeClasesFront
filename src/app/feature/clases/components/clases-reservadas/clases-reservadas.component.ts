import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClaseReservada } from '@clases/shared/model/claseReservada';
import { ClasesService } from '@clases/shared/service/clases.service';
import { Estudiante } from '@core/modelo/estudiante';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { Observable, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmacionComponent } from '@core/components/modal-confirmacion/modal-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clases-reservadas',
  templateUrl: './clases-reservadas.component.html',
  styleUrls: ['./clases-reservadas.component.scss'],
})
export class ClasesReservadasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly MENSAJE_CANCELAR_RESERVA =
    '¿Estás seguro de que quieres cancelar la reserva? Ten en cuenta que no se realizará ningún reembolso.';
  readonly MENSAJE_CANCELADA_EXITOSAMENTE =
    'La cancelación se realizó exitosamente.';
  readonly MENSAJE_CANCELADA_ERRONEO =
    'Se ha producido un error al intentar cancelar la reserva. Por favor, inténtalo de nuevo más tarde.';

  dataSource = new MatTableDataSource<ClaseReservada>();
  obsClase: Observable<ClaseReservada[]>;
  estudianteSeleccionado: Estudiante;

  constructor(
    protected estudianteService: SeleccionEstudianteServiceService,
    protected claseService: ClasesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.precargarDatos();
  }

  limpiarFiltro(): void {
    this.dataSource.filter = '';
  }

  aplicarFiltroTipoClase(tipoSeleccionado: string | null): void {
    this.dataSource.filter = tipoSeleccionado || '';
  }

  actualizarFecha(fecha: Date) {
    this.aplicarFiltroFecha(fecha);
  }

  aplicarFiltroFecha(fecha: Date) {
    if (fecha) {
      this.dataSource.filterPredicate = (data: any) => {
        const dataDate = new Date(data.fechaInicio); 
        return dataDate >= fecha;
      };
  
      this.dataSource.filter = 'ACTIVAR'; // Establece cualquier valor para activar el filtro
    }
  }

  abrirModalConfirmacion(claseReservada: ClaseReservada): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '300px',
      data: { mensaje: this.MENSAJE_CANCELAR_RESERVA },
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      if (resultado) {
        this.eliminar(claseReservada.idReserva);
      }
    });
  }

  eliminar(idReserva: number) {
    this.claseService
      .cancelarClase(idReserva)
      .pipe(
        catchError(() => {
          this.mostrarMensaje(this.MENSAJE_CANCELADA_ERRONEO);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.precargarDatos();
        this.mostrarMensaje(this.MENSAJE_CANCELADA_EXITOSAMENTE);
      });
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private precargarDatos() {
    this.estudianteService
      .getEstudianteSeleccionado()
      .subscribe((estudiante: Estudiante) =>
        this.setEstudianteSeleccionado(estudiante),
      );
  }

  private setEstudianteSeleccionado(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.obtenerClasesReservadas();
  }

  private obtenerClasesReservadas(): void {
    const { id } = this.estudianteSeleccionado;
    this.claseService.consultarClasesReservadas(id).subscribe((response) => {
      this.setClasesReservadas(response);
    });
  }

  private setClasesReservadas(clases: ClaseReservada[]): void {
    this.dataSource.data = clases;
    this.dataSource.paginator = this.paginator;
    this.obsClase = this.dataSource.connect();
  }
}
