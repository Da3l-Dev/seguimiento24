/**
 * app.module.ts
 * Se usa para poder comunicar entere los distintos modulos
 *  */ 

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatrizSeguimientoModule } from './matriz/matriz-seguimiento.module'; // Importa MatrizSeguimientoModule
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminSeguimientoModule } from './adim/admin-seguimiento.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SeguimientoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatrizSeguimientoModule,
    AdminSeguimientoModule,
    ButtonModule,
    BrowserAnimationsModule, // Necesario para Toastr
    ToastrModule.forRoot({
      preventDuplicates: true
    }), // Configuración del módulo Toastr
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
