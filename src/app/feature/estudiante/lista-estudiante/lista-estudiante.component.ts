import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Estudiante } from '@core/modelo/estudiante';
import { EstudianteService } from '@estudiante/shared/service/estudiante.service';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';

@Component({
  selector: 'app-lista-estudiante',
  templateUrl: './lista-estudiante.component.html',
  styleUrls: ['./lista-estudiante.component.scss'],
})
export class ListaEstudianteComponent implements OnInit {
  estudiantes: Estudiante[];

  constructor(
    protected service: EstudianteService,
    protected estudianteService: SeleccionEstudianteServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.consultar().subscribe((response) => {
      this.estudiantes = response;
    });
  }

  seleccionarEstudiante(estudiante: Estudiante) {
    this.estudianteService.seleccionarEstudiante(estudiante);
    this.router.navigate(['/clases/reserva/disponibles']);
  }
}
