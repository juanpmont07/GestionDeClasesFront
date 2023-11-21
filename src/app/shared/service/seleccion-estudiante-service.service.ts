import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Estudiante } from '@core/modelo/estudiante';

@Injectable({
  providedIn: 'root'
})
export class SeleccionEstudianteServiceService {

  private estudianteSeleccionado = new BehaviorSubject<Estudiante>(null);

  constructor() { }

  seleccionarEstudiante(estudiante: Estudiante) {
    this.estudianteSeleccionado.next(estudiante);
  }

  getEstudianteSeleccionado(): Observable<Estudiante>{
    return this.estudianteSeleccionado.asObservable();
  }
}
