import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.scss'
})
export class SeguimientoComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isRedirecting: boolean = false;
  constructor(private userService: UserService, private router: Router) {}
  
  onSubmit(): void {
    this.userService.authUser(this.username, this.password).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response.status); // Verifica la respuesta de la API
        if (response.status === 'success') {
          this.userService.getUserData().subscribe(data => {
            if (data?.tipoUsuario === 5 && !this.isRedirecting) {
              this.isRedirecting = true; // Activa el flag para evitar bucles
              this.router.navigate(['/matrizSeguimiento']);
            } else if( data?.tipoUsuario === 3 && !this.isRedirecting){
              this.isRedirecting = true;
              this.router.navigate(['/admin']);
            }
          });
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Error en la solicitud', error);
        this.errorMessage = error.error.message || 'Error en el servidor, intenta nuevamente';
      }
    );
  }
}
