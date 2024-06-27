import { Component, OnInit } from '@angular/core';
import { NotaService } from 'src/app/servicios/nota.service';
import { Notas } from 'src/app/modelos/Notas';
import { LibretaDTO } from 'src/app/modelos/LibretaDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vernota',
  templateUrl: './vernota.component.html',
  styleUrls: ['./vernota.component.css']
})
export class VernotaComponent implements OnInit {
  nota: Notas | null = null;
  notaId!: number;
  libretas: LibretaDTO[] = [];
  libretaSeleccionada: number | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '70vh', /* Ajusta esta altura según tus necesidades */
    minHeight: '70vh', /* Ajusta esta altura según tus necesidades */
    maxHeight: '70vh', /* Ajusta esta altura según tus necesidades */
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

  constructor(
    private notaService: NotaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.notaId = Number(params.get('id'));
      this.cargarNota(this.notaId);
      this.cargarLibretas();
    });
  }

  cargarNota(id: number): void {
    this.notaService.obtenerNotaPorId(id).subscribe(
      (nota: Notas) => {
        this.nota = nota;
      },
      (error: any) => {
        console.error('Error al cargar la nota:', error);
      }
    );
  }

  cargarLibretas(): void {
    this.notaService.obtenerLibretas().subscribe(
      (libretas: LibretaDTO[]) => {
        this.libretas = libretas;
      },
      (error: any) => {
        console.error('Error al cargar las libretas:', error);
      }
    );
  }

  actualizarNota(): void {
    if (this.nota) {
      this.notaService.actualizarNotaSinLibreta(this.nota.id!, this.nota).subscribe({
        next: (notaActualizada: Notas) => {
          console.log('Nota actualizada:', notaActualizada);
          this.router.navigate(['/user/notaspag']);
        },
        error: (err: any) => {
          console.error('Error al actualizar la nota:', err);
        }
      });
    }
  }

  asignarLibreta(): void {
    if (this.nota && this.libretaSeleccionada) {
      this.notaService.asignarLibreta(this.nota.id!, this.libretaSeleccionada).subscribe({
        next: (notaActualizada: Notas) => {
          console.log('Libreta asignada:', notaActualizada);
          this.cargarNota(this.notaId);
        },
        error: (err: any) => {
          console.error('Error al asignar la libreta:', err);
        }
      });
    }
  }

  eliminarNota(): void {
    if (this.nota) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.notaService.eliminarNotaSinLibreta(this.nota!.id!).subscribe({
            next: () => {
              console.log('Nota eliminada');
              this.router.navigate(['/user/notaspag']);
            },
            error: (err: any) => {
              console.error('Error al eliminar la nota:', err);
            }
          });
        }
      });
    }
  }

  volverAtras(): void {
    this.router.navigate(['/user/notaspag']);
  }
}
