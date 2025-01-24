import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class FilesServicesService {
  private baseUrl = environment.apiUrl + '/files'; // URL base del servidor
  constructor(private http: HttpClient) {}

  /**
   * Subir Archivo de Cedulas de evidencias por trimestre
   */
  
  subirArchivoEvidencia(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subirEvidencia`, data);
  }


  obtenerEvidenciaRuta(params: any): Observable<{ success: boolean; ruta: string }> {
    return this.http.get<{ success: boolean; ruta: string }>(`${this.baseUrl}/obtenerEvidenciaRuta`, { params });
  }

  
  eliminarRutaEvidencia(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('idEjercicio', params.idEjercicio)
      .set('idIndicador', params.idIndicador)
      .set('idArea', params.idArea)
      .set('idPrograma', params.idPrograma)
      .set('idTrimestre', params.idTrimestre);
  
    return this.http.delete(`${this.baseUrl}/eliminarRuta`, { params: httpParams });
  }  

  /**
   * Subir Archivos de la MIR Firmada
   */

  subirArchivoMir(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subirMir`, data);
  }

  // Obtener ruta de los archivos de las MIR Firmadas

  obtenerRutasMirArea(idArea: number): Observable<any> {
    const params = new HttpParams().set('idArea', idArea.toString());

    return this.http.get<any>(`${this.baseUrl}/rutasMir`,{params}).pipe(
          map((response: { data: any; }) => Array.isArray(response) ? response : response.data || [])
        );
  }

}
