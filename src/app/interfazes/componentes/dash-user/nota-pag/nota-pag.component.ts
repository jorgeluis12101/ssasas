// nota-pag.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notas } from 'src/app/modelos/Notas';
import { NotaService } from 'src/app/servicios/nota.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-nota-pag',
  templateUrl: './nota-pag.component.html',
  styleUrls: ['./nota-pag.component.css']
})
export class NotaPagComponent implements OnInit {

  notasSinLibreta: Notas[] = [];
  nuevaNota: Notas = new Notas();
  notaSeleccionada: Notas | null = null;
  categoriaSeleccionada: string = '';
  prioridadSeleccionada: string = '';

  categorias: string[] = ['Trabajo', 'Personal', 'Estudio']; // Categorías disponibles
  prioridades: string[] = ['Alta', 'Media', 'Baja']; // Prioridades disponibles

  constructor(
    private notaService: NotaService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.obtenerNotasSinLibreta();
  }

  crearNota() {
    this.router.navigate(['/user/crearnota']);
  }

  obtenerNotasSinLibreta() {
    this.notaService.obtenerNotasSinLibreta().subscribe(
      response => {
        this.notasSinLibreta = response;
      },
      error => {
        console.error('Error al obtener las notas:', error);
      }
    );
  }

  filtrarNotas() {
    this.notaService.filtrarNotas(this.categoriaSeleccionada, this.prioridadSeleccionada).subscribe(
      response => {
        this.notasSinLibreta = response;
      },
      error => {
        console.error('Error al filtrar las notas:', error);
      }
    );
  }

  eliminarNota(notaId: number) {
    this.notaService.eliminarNotaSinLibreta(notaId).subscribe(
      () => {
        console.log('Nota eliminada');
        this.obtenerNotasSinLibreta();
      },
      error => {
        console.error('Error al eliminar la nota:', error);
      }
    );
  }

  editarNota(nota: Notas) {
    this.notaSeleccionada = { ...nota };
  }

  truncarTexto(texto: string, maxLength: number): string {
    if (texto.length > maxLength) {
      return texto.substring(0, maxLength) + '...';
    } else {
      return texto;
    }
  }

  stripHtml(html: string): string {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  verNota(nota: Notas) {
    this.router.navigate(['/user/vernotas', nota.id]);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatFecha(fecha: Date | undefined): string {
    if (!fecha) return '';
    return formatDate(fecha, 'dd-MM-yyyy', 'en-US');
  }
}
