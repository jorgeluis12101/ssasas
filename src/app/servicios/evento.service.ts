import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DatosRegistroEvento {
  titulo: string;
  contenido: string;
  fecha: string;
  prioridad: string;
  recordatorio: string;
  categoriaId: number;
}

export interface Evento {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  prioridad: string;
  completado: boolean;
  recordatorio: string;
  usuario: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/v1/eventos';

  constructor(private http: HttpClient) {}

  registrarEvento(eventData: DatosRegistroEvento): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, eventData);
  }

  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/listar`);
  }

  eliminarEvento(eventoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${eventoId}`);
  }

  actualizarFechaEvento(eventoId: number, nuevaFecha: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar-fecha/${eventoId}`, { fecha: nuevaFecha });
  }

  cambiarEstadoEvento(eventoId: number, nuevoEstado: boolean): Observable<Evento> {
    console.log(`Llamando a cambiarEstadoEvento con eventoId: ${eventoId} y nuevoEstado: ${nuevoEstado}`);
    const url = `${this.apiUrl}/actualizar-estado/${eventoId}`;
    console.log(`URL del endpoint: ${url}`);
    return this.http.put<Evento>(url, { completado: nuevoEstado });
  }
}
