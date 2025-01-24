/** Este codigo permite llamar a la api php y poder usarlo como servicio en el proyecto angular.
 * Cuenta con las funciones
 *  - authUser <- Inicia sesion del usuario y lo autentifica
 *  - check-auth <- Revisa si el usuario esta autentificado para darle acceso a la vista principal
 *  - logoutUser <- Cierre de sesion del usuario
 *  - getUserData <- Retorna un modelo con los datos importantes del usuario
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User } from '../matriz/model/user.model';
import { environment } from '../../environment';
 // Importa la interfaz User

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  
  // Datos del usuario
  private userData = new BehaviorSubject<User | null>(null); // Tipado con User

  constructor(private http: HttpClient) {}

  // Función para iniciar sesión en la API
  authUser(username: string, password: string): Observable<any> {
    return this.http.post<{ status: string; user: User }>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          this.isAuthenticated.next(true);
          this.userData.next(response.user); // Almacena los datos del usuario en userData
        })
      );
  }

  // Función para verificar la autenticación
  checkAuth(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean; user: User }>(`${this.apiUrl}/check-auth`, { withCredentials: true })
      .pipe(
        tap(response => console.log('Respuesta de checkAuth:', response)),
        map(response => {
          const isAuth = !!response.authenticated;
          if (isAuth) {
            this.userData.next(response.user); // Almacena los datos del usuario si está autenticado
          }
          return isAuth;
        }),
        tap(isAuth => this.isAuthenticated.next(isAuth))
      );
  }

  // Método para obtener los datos del usuario desde otros componentes
  getUserData(): Observable<User | null> {
    return this.userData.asObservable();
  }

  // Función para cerrar sesión
  logoutUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticated.next(false);
          this.userData.next(null); // Limpia los datos de usuario al cerrar sesión
        })
      );
  }
}
