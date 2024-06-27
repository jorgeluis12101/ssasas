import { Component, OnInit } from '@angular/core';
import { NotaService } from '../../../../servicios/nota.service';
import { NotaDTO } from '../../../../modelos/NotaDTO';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare var bootstrap: any;

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.css']
})
export class NotaComponent implements OnInit {
  notas: NotaDTO[] = [];
  nuevaNota: NotaDTO = { titulo: '', contenido: '', libreta: { id: 0 } };
  libretaId: number = 0;
  notaIdAEliminar?: number;

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
    sanitize: true,
    toolbarHiddenButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'],
      ['fontSize', 'textColor', 'backgroundColor', 'customClasses', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode']
    ]
  };

  constructor(private notaService: NotaService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.libretaId = Number(params.get('id'));
      this.obtenerNotasPorLibreta();
    });
  }

  obtenerNotasPorLibreta(): void {
    this.notaService.obtenerNotasPorLibreta(this.libretaId).subscribe((notas: NotaDTO[]) => {
      this.notas = notas;
    });
  }

  crearNota(): void {
    this.nuevaNota.libreta.id = this.libretaId;
    this.notaService.registrarNota(this.nuevaNota).subscribe({
      next: (nota: NotaDTO) => {
        this.notas.push(nota);
        this.nuevaNota.titulo = '';
        this.nuevaNota.contenido = '';
        this.cerrarModal('crearNotaModal');
      },
      error: (err: any) => {
        console.error('Error al crear la nota:', err);
      }
    });
  }

  abrirModalCrear(): void {
    const modal = document.getElementById('crearNotaModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  abrirModalEliminar(id: number): void {
    this.notaIdAEliminar = id;
    const modal = document.getElementById('confirmarEliminarModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  confirmarEliminar(): void {
    if (this.notaIdAEliminar !== undefined) {
      this.eliminarNota(this.notaIdAEliminar);
      this.cerrarModal('confirmarEliminarModal');
    }
  }

  eliminarNota(id: number): void {
    this.notaService.eliminarNota(id).subscribe({
      next: () => {
        this.notas = this.notas.filter(nota => nota.id !== id);
      },
      error: (err: any) => {
        console.error('Error al eliminar la nota:', err);
      }
    });
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
}
