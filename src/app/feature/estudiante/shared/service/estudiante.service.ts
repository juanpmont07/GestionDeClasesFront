import { Injectable } from '@angular/core';
import { Estudiante } from '../../../../core/modelo/estudiante';
import { HttpService } from '@core/services/http.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable()
export class EstudianteService {
  constructor(protected http: HttpService) {}

  public consultar() {
    return this.http
      .doGet(`${environment.endpoint}/estudiante`)
      .pipe(map((response) => response as Estudiante[]));
  }
}
