import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmasServiceService {

  private baseUrl = 'http://localhost/firmas';

  constructor( private http: HttpClient) { }

  getFirmasProyecto(idProyecto: number){
    const params = new HttpParams().set('idProyecto', idProyecto.toString());
  
    return this.http.get<any>(`${this.baseUrl}/obtenerFirmas`, { params }).pipe(
      map(response => {
        console.log(response); // Verifica lo que llega
        return Array.isArray(response) ? response : response.data || [];
      })
    );
  }
  
}
