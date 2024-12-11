import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Método DELETE para eliminar el archivo
  eliminarRuta(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('idEjercicio', params.idEjercicio)
      .set('idIndicador', params.idIndicador)
      .set('idArea', params.idArea)
      .set('idPrograma', params.idPrograma)
      .set('idTrimestre', params.idTrimestre);
  
    return this.http.delete(`${this.baseUrl}/eliminarRuta`, { params: httpParams });
  }  
}
