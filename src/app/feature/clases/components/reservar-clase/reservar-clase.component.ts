import { Component, OnInit, ViewChild } from '@angular/core';
import { Clase } from '@core/modelo/clase';
import { ClasesService } from '@clases/shared/service/clases.service';
import { Estudiante } from '@core/modelo/estudiante';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservarClaseDTO } from '@clases/shared/model/reservarClaseDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservar-clase',
  templateUrl: './reservar-clase.component.html',
  styleUrls: ['./reservar-clase.component.scss'],
})
export class ReservarClaseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Clase>();
  obsClase: Observable<Clase[]>;
  estudianteSeleccionado: Estudiante;
  clasesSeleccionadas: Clase[] = [];
  saldoTotal = 0;

  readonly MENSAJE_ERROR_NO_TIENE_CLASES_SELECCIONADAS =
    'Debes de seleccionar al menos 2 clases para reservar.';
  readonly MENSAJE_RESERVO_EXITOSAMENTE =
    'La reserva de tus clase fue exitosa.';

  constructor(
    protected estudianteService: SeleccionEstudianteServiceService,
    protected claseService: ClasesService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.estudianteService
      .getEstudianteSeleccionado()
      .subscribe((estudiante: Estudiante) =>
        this.setEstudianteSeleccionado(estudiante),
      );
  }

  setEstudianteSeleccionado(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.obtenerClasesDisponibles();
  }

  obtenerClasesDisponibles(): void {
    const { nivelDeIngles, id } = this.estudianteSeleccionado;
    this.claseService
      .consultarClasesDisponibles(nivelDeIngles, id)
      .subscribe((response) => {
        this.setClasesDisponibles(response);
      });
  }

  setClasesDisponibles(clases: Clase[]): void {
    this.dataSource.data = clases.map((clase) => {
      clase.seleccionada = false;
      return clase;
    });
    this.dataSource.paginator = this.paginator;
    this.obsClase = this.dataSource.connect();
  }

  toggleSeleccionClase(clase: Clase): void {
    if (!this.puedeSeleccionarClase(clase)) {
      clase.seleccionada = false;
      this.actualizarDataSource(clase);

      this.mostrarMensaje(
        'Solo puedes seleccionar mas de una clase de un mismo tipo.',
      );
      return;
    }
    clase.seleccionada = !clase.seleccionada;
    this.actualizarClasesSeleccionadas(clase);
    this.actualizarDataSource(clase);
  }

  puedeSeleccionarClase(clase: Clase): boolean {
    const [primeraClaseSeleccionada] = this.clasesSeleccionadas;
    return (
      !primeraClaseSeleccionada ||
      (this.clasesSeleccionadas.every(
        (c) => c.tipoClase === primeraClaseSeleccionada.tipoClase,
      ) &&
        clase.tipoClase === primeraClaseSeleccionada.tipoClase)
    );
  }

  actualizarClasesSeleccionadas(clase: Clase): void {
    if (clase.seleccionada) {
      this.actualizarSaldo(clase, true);
      this.clasesSeleccionadas.push(clase);
    } else {
      const index = this.clasesSeleccionadas.findIndex(
        (c) => c.id === clase.id,
      );
      if (index !== -1) {
        this.actualizarSaldo(clase, false);
        this.clasesSeleccionadas.splice(index, 1);
      }
    }
  }

  actualizarSaldo(clase: Clase, esSuma: boolean) {
    this.saldoTotal = esSuma
      ? this.saldoTotal + clase.precio
      : this.saldoTotal - clase.precio;
  }

  actualizarDataSource(clase: Clase): void {
    const index = this.dataSource.data.findIndex((c) => c.id === clase.id);
    if (index !== -1) {
      this.dataSource.data[index] = clase;
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  quitarClaseSeleccionada(index: number): void {
    const clase = this.clasesSeleccionadas[index];
    clase.seleccionada = false;
    this.clasesSeleccionadas.splice(index, 1);
  }

  reservar(): void {
    if (this.clasesSeleccionadas.length > 1) {
      this.claseService.reservarClases(this.crearReservaDTO()).subscribe({
        next: () => {
          this.mostrarMensaje(this.MENSAJE_RESERVO_EXITOSAMENTE);
          this.router.navigate(['/clases/reserva/reservadas']);
        },
        error: (response) => {
          this.mostrarMensaje(response.error.mensaje);
        },
      });
    } else {
      this.mostrarMensaje(this.MENSAJE_ERROR_NO_TIENE_CLASES_SELECCIONADAS);
    }
  }

  crearReservaDTO(): ReservarClaseDTO {
    const idsClases: number[] = this.clasesSeleccionadas.map(
      (clase) => clase.id,
    );
    const tipoClase: string = this.clasesSeleccionadas[0]?.tipoClase || '';
    return {
      idEstudiante: this.estudianteSeleccionado.id,
      idsClases,
      tipoClase,
    };
  }

  limpiarFiltro(): void {
    this.dataSource.filter = '';
  }

  aplicarFiltroTipoClase(tipoSeleccionado: string | null): void {
    this.dataSource.filter = tipoSeleccionado || '';
  }

  actualizarFecha(fecha: Date){
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

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
