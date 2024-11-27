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

  constructor(private userService: UserService, private router: Router) {}
  
  onSubmit(): void {
    this.userService.authUser(this.username, this.password).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response); // Verifica la respuesta de la API
        if (response.status === 'success') {
            this.router.navigateByUrl('/matrizSeguimiento');// Redirige al dashboard protegido
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
