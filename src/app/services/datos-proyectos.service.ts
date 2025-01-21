import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DatosProyectosService {
  private baseUrl = 'http://18.116.81.206/proyecto';  // URL base de la API

  constructor(private http: HttpClient) {}

  // Método para obtener los datos del proyecto
  getDataProyects(idArea: number, year: number): Observable<any[]> {
    const params = new HttpParams()
      .set('idArea', idArea.toString())
      .set('Year', year.toString());
    return this.http.get<any>(`${this.baseUrl}/datos`, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }

  // Método para obtener las variables
  getVariables(idArea: number, year: number): Observable<any[]> {
    const params = new HttpParams()
      .set('idArea', idArea.toString())
      .set('Year', year.toString());

    return this.http.get<any>(`${this.baseUrl}/variables`, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }

  // Metodo para obtener las metas programas
  getMetasProg(idArea: number, year: number){
    const params = new HttpParams()
    .set('idArea', idArea.toString())
    .set('Year', year.toString());

    return this.http.get<any>(`${this.baseUrl}/metasProg`, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }

  // Metodo para obtener datos del seguimiento
  getSeguimiento(idArea: number){
    const params = new HttpParams().set('idArea', idArea.toString());

    return this.http.get<any>(`${this.baseUrl}/seguimiento`,{params}).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }


  // Metodo para obtener metas alcazadas
  getMetasAlcanzadas(idArea: number){
    const params = new HttpParams().set('idArea', idArea.toString());

    return this.http.get<any>(`${this.baseUrl}/metasAlcanzada`,{params}).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );

  }


  // Metodo para obtener los datos de trimestre Activo
  getTrimActivo(idArea: number){
    const params = new HttpParams().set('idArea', idArea.toString());

    return this.http.get<any>(`${this.baseUrl}/trimActivo`,{params}).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }

  // Metodo para obtener logros del area
  getLogros(idEjercicio:number, idArea: number, idTrimestre: number, idIndentificador: number){
    const params = new HttpParams()
      .set( 'idEjercicio' , idEjercicio.toString())
      .set('idArea', idArea.toString())
      .set('idTrim', idTrimestre.toString())
      .set('idIndicador', idIndentificador.toString());
      
    return this.http.get<any>(`${this.baseUrl}/logros`,{params}).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }

  subirLogro(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subirLogro`, data);
  }


  getMirProyecto(idArea: number){
    const params = new HttpParams().set('idArea', idArea.toString());

    return this.http.get<any>(`${this.baseUrl}/mir`,{params}).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }
}