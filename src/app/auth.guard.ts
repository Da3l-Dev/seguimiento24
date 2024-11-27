/**
 *  auth.guard es un codigo que me permite bloquear el acceso a la vista matriz si el usuario 
 *  no esta autentificado.
 * */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.checkAuth().pipe(
      tap(isAuth => {
        if (!isAuth) {
          console.log('Usuario no autenticado, redirigiendo a /seguimiento');
          this.router.navigate(['/seguimiento']);
        } else {
          console.log('Usuario autenticado, acceso permitido');
        }
      }),
      map(isAuth => isAuth) // Retorna el estado de autenticación
    );
  }
}
