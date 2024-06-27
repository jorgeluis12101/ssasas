import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaDTO } from '../modelos/NotaDTO';
import { Notas } from '../modelos/Notas';
import { LibretaDTO } from '../modelos/LibretaDTO';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = 'http://localhost:8080/api/notas';

  constructor(private http: HttpClient) { }

  obtenerNotasPorLibreta(libretaId: number): Observable<NotaDTO[]> {
    return this.http.get<NotaDTO[]>(`${this.apiUrl}/libreta/${libretaId}`);
  }

  registrarNota(nota: NotaDTO): Observable<NotaDTO> {
    return this.http.post<NotaDTO>(`${this.apiUrl}/crear`, nota);
  }

  actualizarNota(notaId: number, nota: NotaDTO): Observable<NotaDTO> {
    return this.http.put<NotaDTO>(`${this.apiUrl}/actualizar/${notaId}`, nota);
  }
  eliminarNota(notaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${notaId}`);
  }

  buscarNotas(keyword: string, libretaId: number): Observable<NotaDTO[]> {
    let params = new HttpParams()
      .set('libretaId', libretaId.toString())
      .set('keyword', keyword);
    return this.http.get<NotaDTO[]>(`${this.apiUrl}/buscar`, { params });
  }

  //////SERVICOS AGREGADOOOOS///////////

  crearNotaSinLibreta(nota: Notas): Observable<Notas> {
    return this.http.post<Notas>(`${this.apiUrl}/crear-sin-libreta`, nota);
  }
  // Obtener Notas Sin Libreta
  obtenerNotasSinLibreta(): Observable<Notas[]> {
    return this.http.get<Notas[]>(`${this.apiUrl}/usuario-sin-libreta`);
  }

  // Actualizar Nota Sin Libreta
  actualizarNotaSinLibreta(id: number, nota: Notas): Observable<Notas> {
    return this.http.put<Notas>(`${this.apiUrl}/actualizar-sin-libreta/${id}`, nota);
  }

  // Eliminar Nota Sin Libreta
  eliminarNotaSinLibreta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar-sin-libreta/${id}`);
  }

  obtenerNotaPorId(notaId: number): Observable<Notas> {
    return this.http.get<Notas>(`${this.apiUrl}/${notaId}`);
  }
  filtrarNotas(categoria?: string, prioridad?: string): Observable<NotaDTO[]> {
    let params = new HttpParams();
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    if (prioridad) {
      params = params.set('prioridad', prioridad);
    }
    return this.http.get<NotaDTO[]>(`${this.apiUrl}/filtrar`, { params });
  }

  obtenerLibretas(): Observable<LibretaDTO[]> {
    return this.http.get<LibretaDTO[]>(`http://localhost:8080/api/libretas`);
  }

  asignarLibreta(notaId: number, libretaId: number): Observable<Notas> {
    return this.http.put<Notas>(`${this.apiUrl}/asignar-libreta/${notaId}?libretaId=${libretaId}`, {});
  }

}