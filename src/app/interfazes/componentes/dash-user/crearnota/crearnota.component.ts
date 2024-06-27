import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notas } from 'src/app/modelos/Notas';
import { NotaService } from 'src/app/servicios/nota.service';
import { LibretaService } from 'src/app/servicios/libreta.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-crearnota',
  templateUrl: './crearnota.component.html',
  styleUrls: ['./crearnota.component.css']
})
export class CrearnotaComponent implements OnInit {

  nuevaNota: Notas = new Notas();
  prioridades: string[] = ['Alta', 'Media', 'Baja'];
  categorias: string[] = ['Trabajo', 'Personal', 'Estudio'];
  libretas: { id: number, nombre: string }[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '70vh',
    minHeight: '70vh',
    maxHeight: '70vh',
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
    private libretaService: LibretaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.libretaService.obtenerLibretas().subscribe(
      (libretas: { id: number, nombre: string }[]) => {
        this.libretas = libretas;
      },
      error => {
        console.error('Error al obtener las libretas:', error);
      }
    );
  }

  crearNota() {
    this.notaService.crearNotaSinLibreta(this.nuevaNota).subscribe(
      response => {
        console.log('Nota creada:', response);
        this.router.navigate(['/user/notaspag']);
      },
      error => {
        console.error('Error al crear la nota:', error);
      }
    );
  }
  volverAtras(): void {
    this.router.navigate(['/user/notaspag']);
  }
}
