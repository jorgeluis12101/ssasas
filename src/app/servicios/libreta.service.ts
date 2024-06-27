import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibretaDTO } from '../modelos/LibretaDTO';
import baserUrl from '../servicios/helper';

@Injectable({
  providedIn: 'root'
})
export class LibretaService {

  private apiUrl = `${baserUrl}/api/libretas`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  crearLibreta(nombre: string): Observable<LibretaDTO> {
    return this.http.post<LibretaDTO>(`${this.apiUrl}/crear`, { nombre }, { headers: this.getAuthHeaders() });
  }

  obtenerLibretaPorId(id: number): Observable<LibretaDTO> {
    return this.http.get<LibretaDTO>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  obtenerLibretasPorUsuario(): Observable<LibretaDTO[]> {
    return this.http.get<LibretaDTO[]>(`${this.apiUrl}/usuario`, { headers: this.getAuthHeaders() });
  }

  eliminarLibreta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers: this.getAuthHeaders() });
  }
  buscarLibretas(nombre: string): Observable<LibretaDTO[]> {
    return this.http.get<LibretaDTO[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }

  obtenerLibretas(): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(`${baserUrl}`);
  }
}
