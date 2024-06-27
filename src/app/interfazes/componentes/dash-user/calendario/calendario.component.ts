import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventDropArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog } from '@angular/material/dialog';
import { DatosRegistroEvento, EventoService, Evento } from '../../../../servicios/evento.service';
import { EventModalComponent, EventData } from '../event-modal/event-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendarVisible = true;
  isExpanded = false;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' 
    },
    initialView: 'dayGridMonth',
    locales: [esLocale],
    locale: 'es',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private eventoService: EventoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventoService.obtenerEventos().subscribe(
      (eventos: Evento[]) => {
        const calendarEvents: EventInput[] = eventos.map(evento => ({
          id: String(evento.id),
          title: `${evento.titulo}`,
          start: evento.fecha,
          end: evento.fecha,
          allDay: true
        }));
        this.calendarOptions.events = calendarEvents;
        this.currentEvents = calendarEvents as EventApi[];
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error al cargar los eventos', error);
      }
    );
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    const eventoId = Number(eventDropInfo.event.id);
    const nuevaFecha = eventDropInfo.event.startStr;

    this.eventoService.actualizarFechaEvento(eventoId, nuevaFecha).subscribe(
      () => {
        Swal.fire({
          title: 'Actualizado',
          text: 'La fecha del evento ha sido actualizada con éxito.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.cargarEventos();
      },
      (error) => {
        console.error('Error al actualizar la fecha del evento', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar la fecha del evento.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    );
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '500px',
      data: {
        titulo: '',
        contenido: '',
        fecha: selectInfo.startStr,
        prioridad: '',
        recordatorioFecha: '',  // Añadir campo recordatorioFecha
        recordatorioHora: '',   // Añadir campo recordatorioHora
        categoriaId: null
      } as EventData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const recordatorio = `${result.recordatorioFecha}T${result.recordatorioHora}:00`;
        const newEvent: DatosRegistroEvento = {
          titulo: result.titulo,
          contenido: result.contenido,
          fecha: result.fecha,
          prioridad: result.prioridad,
          recordatorio: recordatorio,
          categoriaId: result.categoriaId
        };

        this.eventoService.registrarEvento(newEvent).subscribe(
          () => {
            Swal.fire(
              'Registrado',
              'El evento ha sido registrado con éxito.',
              'success'
            );
            this.cargarEventos();
          },
          (error) => {
            console.error('Error al registrar el evento', error);
            Swal.fire(
              'Error',
              'Hubo un problema al registrar el evento.',
              'error'
            );
          }
        );
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro de que quieres eliminar el evento '${clickInfo.event.title}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.eliminarEvento(Number(clickInfo.event.id)).subscribe(
          () => {
            console.log('Evento eliminado con éxito');
            clickInfo.event.remove();
            Swal.fire(
              'Eliminado',
              'El evento ha sido eliminado.',
              'success'
            );
          },
          (error) => {
            console.error('Error al eliminar el evento', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el evento.',
              'error'
            );
          }
        );
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
