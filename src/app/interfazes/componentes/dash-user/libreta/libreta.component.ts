import { Component, OnInit } from '@angular/core';
import { LibretaService } from '../../../../servicios/libreta.service';
import { NotaService } from '../../../../servicios/nota.service';
import { LibretaDTO } from '../../../../modelos/LibretaDTO';
import { NotaDTO } from '../../../../modelos/NotaDTO';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-libreta',
  templateUrl: './libreta.component.html',
  styleUrls: ['./libreta.component.css']
})
export class LibretaComponent implements OnInit {
  libretas: LibretaDTO[] = [];
  notas: NotaDTO[] = [];
  nuevaLibreta: LibretaDTO = { nombre: '' };
  notaSeleccionada: NotaDTO = { titulo: '', contenido: '', libreta: { id: 0 } };
  libretaSeleccionada?: LibretaDTO;
  searchTerm: string = '';
  searchResults: LibretaDTO[] = [];
  notaSearchTerm: string = '';
  notaSearchResults: NotaDTO[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '5rem',
    maxHeight: '15rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Escribe el contenido aquí...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: false,
    toolbarHiddenButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'],
      ['fontSize', 'textColor', 'backgroundColor', 'customClasses', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode']
    ]
  };

  constructor(private libretaService: LibretaService, private notaService: NotaService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerLibretas();
  }

  obtenerLibretas(): void {
    this.libretaService.obtenerLibretasPorUsuario().subscribe(libretas => {
      this.libretas = libretas;
      if (this.libretas.length > 0) {
        this.seleccionarLibreta(this.libretas[0]); // Selecciona la primera libreta automáticamente
      }
    });
  }

  seleccionarLibreta(libreta: LibretaDTO): void {
    this.libretaSeleccionada = libreta;
    if (libreta.id !== undefined) {
      this.obtenerNotasPorLibreta(libreta.id);
    }
  }

  obtenerNotasPorLibreta(libretaId: number): void {
    this.notaService.obtenerNotasPorLibreta(libretaId).subscribe(notas => {
      this.notas = notas;
      this.crearNotaNueva(); // Resetear la nota seleccionada
    });
  }

  seleccionarNota(nota: NotaDTO): void {
    this.notaSeleccionada = { ...nota };
  }

  crearNotaNueva(): void {
    if (this.libretaSeleccionada && this.libretaSeleccionada.id !== undefined) {
      this.notaSeleccionada = { titulo: '', contenido: '', libreta: { id: this.libretaSeleccionada.id } };
    }
  }

  guardarNota(): void {
    if (this.notaSeleccionada.titulo.trim()) {
      if (this.libretaSeleccionada && this.libretaSeleccionada.id !== undefined) {
        if (!this.notaSeleccionada.libreta) {
          this.notaSeleccionada.libreta = { id: 0 }; // Asegurarse de que libreta está inicializada
        }
        this.notaSeleccionada.libreta.id = this.libretaSeleccionada.id;

        if (this.notaSeleccionada.id) {
          this.notaService.actualizarNota(this.notaSeleccionada.id, this.notaSeleccionada).subscribe({
            next: (nota) => {
              const index = this.notas.findIndex(n => n.id === nota.id);
              if (index !== -1) {
                this.notas[index] = nota;
              }
              this.crearNotaNueva(); // Limpiar la nota
              Swal.fire('Nota Actualizada', 'La nota ha sido actualizada exitosamente.', 'success');
            },
            error: (err) => {
              console.error('Error al actualizar la nota:', err);
              Swal.fire('Error', 'Hubo un error al actualizar la nota.', 'error');
            }
          });
        } else {
          this.notaService.registrarNota(this.notaSeleccionada).subscribe({
            next: (nota) => {
              this.notas.push(nota);
              this.crearNotaNueva(); // Limpiar la nota
              Swal.fire('Nota Creada', 'La nota ha sido creada exitosamente.', 'success');
            },
            error: (err) => {
              console.error('Error al crear la nota:', err);
              Swal.fire('Error', 'Hubo un error al crear la nota.', 'error');
            }
          });
        }
      }
    }
  }

  eliminarNota(notaId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notaService.eliminarNota(notaId).subscribe({
          next: () => {
            this.notas = this.notas.filter(nota => nota.id !== notaId);
            this.crearNotaNueva(); // Limpiar la nota seleccionada si se elimina
            Swal.fire('Eliminado', 'La nota ha sido eliminada.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar la nota:', err);
            Swal.fire('Error', 'Hubo un error al eliminar la nota.', 'error');
          }
        });
      }
    });
  }

  confirmarEliminarLibreta(libretaId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminar esta libreta también eliminará todas las notas asociadas. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarLibreta(libretaId);
      }
    });
  }

  eliminarLibreta(libretaId: number): void {
    this.libretaService.eliminarLibreta(libretaId).subscribe({
      next: () => {
        this.libretas = this.libretas.filter(libreta => libreta.id !== libretaId);
        if (this.libretaSeleccionada?.id === libretaId) {
          this.libretaSeleccionada = undefined;
          this.notas = [];
          this.crearNotaNueva();
        }
        Swal.fire('Eliminado', 'La libreta y todas sus notas han sido eliminadas.', 'success');
      },
      error: (err) => {
        console.error('Error al eliminar la libreta:', err);
        Swal.fire('Error', 'Hubo un error al eliminar la libreta.', 'error');
      }
    });
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  abrirModalCrear(): void {
    const modal = document.getElementById('crearLibretaModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  crearLibreta(): void {
    if (this.nuevaLibreta.nombre.trim()) {
      this.libretaService.crearLibreta(this.nuevaLibreta.nombre).subscribe({
        next: (libreta) => {
          this.libretas.push(libreta);
          this.nuevaLibreta.nombre = '';
          this.cerrarModal('crearLibretaModal');
        },
        error: (err) => {
          console.error('Error al crear la libreta:', err);
          Swal.fire('Error', 'Hubo un error al crear la libreta.', 'error');
        }
      });
    }
  }

  private cerrarModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  // Métodos para manejar los filtros
  buscarLibretas(): void {
    if (this.searchTerm.trim()) {
      this.libretaService.buscarLibretas(this.searchTerm).subscribe({
        next: (libretas) => {
          this.searchResults = libretas;
        },
        error: (err) => {
          console.error('Error al buscar libretas:', err);
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  seleccionarLibretaDeBusqueda(libreta: LibretaDTO): void {
    this.seleccionarLibreta(libreta);
    this.searchResults = [];
    this.searchTerm = '';
  }

  // Método para buscar notas
  buscarNotas(): void {
    if (this.libretaSeleccionada && this.libretaSeleccionada.id !== undefined) {
      this.notaService.buscarNotas(this.notaSearchTerm, this.libretaSeleccionada.id).subscribe({
        next: (notas) => {
          this.notaSearchResults = notas;
        },
        error: (err) => {
          console.error('Error al buscar notas:', err);
        }
      });
    }
  }

  seleccionarNotaDeBusqueda(nota: NotaDTO): void {
    this.seleccionarNota(nota);
    this.notaSearchResults = [];
    this.notaSearchTerm = '';
  }
}
