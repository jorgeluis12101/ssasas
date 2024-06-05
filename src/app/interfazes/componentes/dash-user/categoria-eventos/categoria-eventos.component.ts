import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../../servicios/categoria.service';
import { EventoService, Evento } from 'src/app/servicios/evento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-eventos',
  templateUrl: './categoria-eventos.component.html',
  styleUrls: ['./categoria-eventos.component.css']
})
export class CategoriaEventosComponent implements OnInit {
  categorias: any[] = [];
  selectedCategoria: any = null;
  eventosNoCompletados: Evento[] = [];
  eventosCompletados: Evento[] = [];

  constructor(private categoriaService: CategoriaService, private eventoService: EventoService) {}

  ngOnInit(): void {
    console.log('Inicializando CategoriaEventosComponent');
    this.categoriaService.obtenerCategoriasConEventos().subscribe(
      (data: any[]) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener las categorías con eventos:', error);
      }
    );
  }

  selectCategoria(categoria: any): void {
    console.log('Categoría seleccionada:', categoria);
    this.selectedCategoria = categoria;
    this.eventosNoCompletados = categoria.eventos.filter((evento: Evento) => !evento.completado);
    this.eventosCompletados = categoria.eventos.filter((evento: Evento) => evento.completado);
  }

  toggleEstado(evento: Evento): void {
    console.log('Cambiando estado del evento:', evento);
    const nuevoEstado = !evento.completado;
    const estadoAnterior = evento.completado;
    evento.completado = nuevoEstado;

    console.log(`Llamando a cambiarEstadoEvento con eventoId: ${evento.id} y nuevoEstado: ${nuevoEstado}`);
    this.eventoService.cambiarEstadoEvento(evento.id, nuevoEstado).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        if (!response) {
          evento.completado = estadoAnterior;
          console.error('Error: respuesta nula al actualizar el estado del evento en el servidor');
        } else {
          console.log('Estado del evento actualizado en el servidor');
          Swal.fire(
            'Estado Actualizado',
            'El estado del evento ha sido actualizado exitosamente.',
            'success'
          );
          if (nuevoEstado) {
            this.eventosNoCompletados = this.eventosNoCompletados.filter((e: Evento) => e.id !== evento.id);
            this.eventosCompletados.push(evento);
          } else {
            this.eventosCompletados = this.eventosCompletados.filter((e: Evento) => e.id !== evento.id);
            this.eventosNoCompletados.push(evento);
          }
        }
      },
      (error) => {
        evento.completado = estadoAnterior;
        console.error('Error al actualizar el estado del evento:', error);
      }
    );
  }
}
