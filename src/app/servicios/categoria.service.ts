import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = 'https://nueva-carpeta.fly.dev/api/categorias';

  constructor(private http: HttpClient) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/listar`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/crear`, categoria);
  }

  obtenerCategoriasConEventos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/con-eventos`);
  }


}
