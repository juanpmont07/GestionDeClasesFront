import { Injectable } from '@angular/core';
import { HttpService } from '@core-service/http.service';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clase } from '../../../../core/modelo/clase';
import { ReservarClaseDTO } from '../model/reservarClaseDTO';
import { ClaseReservada } from '../model/claseReservada';

@Injectable()
export class ClasesService {
  constructor(protected http: HttpService) {}

  public consultarClasesDisponibles(nivelIngles: string, idEstudiante: number) {
    return this.http
      .doGet(`${environment.endpoint}/clases/${nivelIngles}/${idEstudiante}`)
      .pipe(map((response) => response as Clase[]));
  }

  public consultarClasesReservadas(idEstudiante: number) {
    return this.http
      .doGet(`${environment.endpoint}/clases/reservada/${idEstudiante}`)
      .pipe(map((response) => response as ClaseReservada[]));
  }

  public reservarClases(clases: ReservarClaseDTO) {
    return this.http.doPost(`${environment.endpoint}/reserva`, clases);
  }

  public cancelarClase(idClaseReserva: number) {
    return this.http.doPostNoBody(
      `${environment.endpoint}/reserva/cancelar/${idClaseReserva}`,
    );
  }
}
