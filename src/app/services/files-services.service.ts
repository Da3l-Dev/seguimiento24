import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesServicesService {
  private baseUrl = 'http://localhost/files'; // URL base del servidor

  constructor(private http: HttpClient) {}

  // Método POST para subir la evidencia del indicador
  subirArchivo(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subirEvidencia`, data);
  }

  // Método GET para obtener la ruta del archivo si existe
  obtenerEvidenciaRuta(params: any): Observable<{ success: boolean; ruta: string }> {
    return this.http.get<{ success: boolean; ruta: string }>(`${this.baseUrl}/obtenerEvidenciaRuta`, { params });
  }

  obtenerEvidencia(params: any): Observable<{ success: boolean; ruta: string }> {
    return this.http.get<{ success: boolean; ruta: string }>(`${this.baseUrl}/obtenerPDF`, { params });
  }
}
