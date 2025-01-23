// nav.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  cUnidadOperante: string = '';
  idArea: number = 0;
  programaArea: number = 0;
  currentYear: number = 2024;
  mensajeMarquee: string = '';
  data: any;

  constructor(
    private userService: UserService, 
    private router: Router,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los datos del usuario
    this.userService.getUserData().subscribe(user => {
      if (user) {
        this.cUnidadOperante = user.cUnidadOperante;
        this.idArea = user.idArea;
        this.programaArea = this.obtenerProgramaArea(user.idArea); // Lógica para asignar programaArea
        this.setMensajeMarquee();
        this.sharedDataService.setUserModel(user);
      }
    });
  }

  // Método para asignar el valor de programaArea basado en idArea
  obtenerProgramaArea(idArea: number): number {
    if (idArea >= 71 && idArea <= 77) {
      return 4;
    } else if (idArea >= 1 && idArea <= 45) {
      return 2;
    }
    return 0; // Retorna 0 si no cae en ningún rango (puedes ajustar según sea necesario)
  }

  // Define el mensaje de marquee
  setMensajeMarquee() {
    if (this.programaArea === 2) {
      this.mensajeMarquee = 'Se ha cerrado la captura de indicadores del 3er. Trim 2024. - Inicia proceso de seguimiento y evaluación.';
    } else if (this.programaArea === 4) {
      this.mensajeMarquee = 'Fecha para captura de indicadores: Cerrado el 1er.Trim. - Cerrado 2do.Trim. - 3er.Trim.: 16 al 18 de octubre 2024 - En metas programadas en cero, se solicita capturar la meta alcanzada en 0.';
    }
  }

  // Cerrar sesión
  logout(): void {
    // Llamar al servicio de logout para invalidar la sesión en el servidor
    this.userService.logoutUser().subscribe(() => {
      // Limpiar datos locales
      localStorage.clear();
      sessionStorage.clear();
  
      // Redirigir y recargar completamente la aplicación
      window.location.href = 'seguimiento'; // Navega y recarga
    });
  } 

}
