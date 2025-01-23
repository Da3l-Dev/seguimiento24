// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { MainLayoutComponent } from './matriz/main-layout/main-layout.component';
import { AuthGuard } from './auth.guard';
import { AdimComponent } from './adim/adim.component';


const routes: Routes = [
  { path: 'siplaneva', component: HomeComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
  { path: 'matrizSeguimiento', component: MainLayoutComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdimComponent },
  { path: '', redirectTo: 'seguimiento24/siplaneva', pathMatch: 'full' } // Redirección al inicio como predeterminado
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
