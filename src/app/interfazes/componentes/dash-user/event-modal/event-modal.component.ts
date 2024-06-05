import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../servicios/categoria.service';
import Swal from 'sweetalert2';

export interface EventData {
  titulo: string;
  contenido: string;
  fecha: string;
  prioridad: string;
  recordatorioFecha: string;
  recordatorioHora: string;
  categoriaId: number | null;
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  eventForm: FormGroup;
  categoriaForm: FormGroup;
  categorias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventData
  ) {
    this.eventForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      fecha: [{ value: data.fecha, disabled: true }, Validators.required],
      prioridad: ['', Validators.required],
      recordatorioFecha: ['', Validators.required],
      recordatorioHora: ['', Validators.required],
      categoriaId: [null, [Validators.required, Validators.min(1)]]
    });

    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.cargarCategorias();
  }

  get titulo() {
    return this.eventForm.get('titulo')!;
  }

  get contenido() {
    return this.eventForm.get('contenido')!;
  }

  get fecha() {
    return this.eventForm.get('fecha')!;
  }

  get prioridad() {
    return this.eventForm.get('prioridad')!;
  }

  get recordatorioFecha() {
    return this.eventForm.get('recordatorioFecha')!;
  }

  get recordatorioHora() {
    return this.eventForm.get('recordatorioHora')!;
  }

  get categoriaId() {
    return this.eventForm.get('categoriaId')!;
  }

  cargarCategorias() {
    this.categoriaService.listarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Habilitar temporalmente el campo de fecha para enviar su valor
      this.fecha.enable();
      const recordatorio = `${this.recordatorioFecha.value}T${this.recordatorioHora.value}:00`;
      const formData = { 
        ...this.eventForm.value, 
        recordatorio 
      };
      this.dialogRef.close(formData);
      // Deshabilitar de nuevo el campo de fecha
      this.fecha.disable();
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  onSubmitCategoria(): void {
    if (this.categoriaForm.valid) {
      this.categoriaService.crearCategoria(this.categoriaForm.value).subscribe(
        categoria => {
          this.cargarCategorias();
          Swal.fire('Categoría creada', 'La categoría ha sido creada con éxito', 'success');
        },
        error => {
          console.error('Error al crear la categoría', error);
          Swal.fire('Error', 'Hubo un problema al crear la categoría', 'error');
        }
      );
    } else {
      this.categoriaForm.markAllAsTouched();
    }
  }
}
