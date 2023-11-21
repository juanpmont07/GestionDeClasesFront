import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SeleccionEstudianteServiceService } from '@shared/service/seleccion-estudiante-service.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaClaseGuard implements CanActivate {
  constructor(
    private seleccionEstudianteService: SeleccionEstudianteServiceService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.seleccionEstudianteService.getEstudianteSeleccionado().pipe(
      map((estudiante) => {
        if (estudiante) {
          return true;
        } else {
          this.router.navigate(['/estudiante']);
          return false;
        }
      }),
    );
  }
}
