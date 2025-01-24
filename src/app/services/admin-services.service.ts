import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { map, Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {

  private baseUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  getAllAreas(): Observable<any[]>{
    return this.http.get<any>(`${this.baseUrl}/obtenerAreas`).pipe(
      map(response => Array.isArray(response) ? response: response.data || [])
    )
  }

  
}
