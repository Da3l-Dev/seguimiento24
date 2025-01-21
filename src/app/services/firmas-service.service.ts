import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmasServiceService {

  private baseUrl = 'http://18.116.81.206/firmas';

  constructor( private http: HttpClient) { }

  getFirmasProyecto(idProyecto: number){
    const params = new HttpParams().set('idProyecto', idProyecto.toString());
  
    return this.http.get<any>(`${this.baseUrl}/obtenerFirmas`, { params }).pipe(
      map(response => {
        return Array.isArray(response) ? response : response.data || [];
      })
    );
  }

  setFirmaProyecto(data: FormData): Observable<any>{
    return this.http.post(`${this.baseUrl}/agregarFirma`, data);
  }

  updateFirmaProyecto(data: FormData): Observable<any>{
    return this.http.post(`${this.baseUrl}/editarFirma`, data);
  }
  

  deleteFirmaProyecto(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('idProyecto', params.idProyecto)  
      .set('idCargo', params.idCargo)
      .set('cCurp', params.cCurp);            
  
    return this.http.delete(`${this.baseUrl}/eliminarFirma`, { params: httpParams });
  }

  getCatCargo(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/obtenerCargo`).pipe(
      map(response => {
        console.log(response); // Verifica lo que llega del backend
        // Asegúrate de que 'response.data' sea un array o devuélvelo como un array vacío
        return Array.isArray(response?.data) ? response.data : [];
      })
    );
  }
  
}
