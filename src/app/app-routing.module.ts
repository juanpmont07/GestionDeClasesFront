import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservaClaseGuard } from '@core/guard/reserva-clase.guard';
import { HomeComponent } from '@home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/estudiante', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'clases',
    canActivate: [ReservaClaseGuard],
    loadChildren: () =>
      import('@clases/clases.module').then((mod) => mod.ClasesModule),
  },
  {
    path: 'estudiante',
    loadChildren: () =>
      import('@estudiante/estudiante.module').then(
        (mod) => mod.EstudianteModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
