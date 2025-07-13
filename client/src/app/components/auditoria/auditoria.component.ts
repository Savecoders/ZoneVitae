import { Component } from '@angular/core';
import { LayoutComponent } from '../shared/layout/layout.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MatTableModule } from '@angular/material/table';
import { CardComponent } from '../shared/primitives';
import {
  LucideAngularModule,
  FileSearch,
  TicketPlusIcon,
} from 'lucide-angular';
import {
  Reporte,
  EstadoReporte,
  SeguimientoReporteEnum,
  PrioridadSeguimientoReporte,
  SeguimientoReporte,
  ReporteCompleto,
} from '../../models';
import { ReporteService } from '../../services/reporte.service';
import { AuthService } from '../../services/auth.service';
import { ComunidadService } from '../../services/comunidad.service';
import { Comunidad } from '../../models';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { SeguimientoService } from '../../services/seguimiento.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { InputComponent } from '../shared/primitives';
import { ReportenorService } from 'app/services/reportenor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auditoria',
  imports: [
    LayoutComponent,
    LucideAngularModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    FooterComponent,
    MatDialogModule,
    CardComponent,
    CommonModule,
    MatCheckboxModule,
  ],
  standalone: true,
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
})
export class AuditoriaComponent {
  readonly FileSearch = FileSearch;

  displayedColumns: string[] = [
    'titulo',
    'comunidad',
   // 'fecha',
    'estado',
    'seguimiento',
    'acciones',
  ];
  dataSource: ReporteCompleto[] = [];
  comunidades: Comunidad[] = [];
  loading = true;
  filtroBusqueda: string = '';
  filtro: string = '';

  mostrandoDetalleCompleto = false;
  reporteSeleccionado: ReporteCompleto | null = null;

  editForm: FormGroup;
  showEditForm = false;
  currentReporte: Reporte | null = null;
  estadoOptions = Object.values(EstadoReporte);
  //seguimientoOptions = Object.values(SeguimientoReporteEnum);
  showRazonField = false;
  comunidadesData: any;
  showCommentForm = false;
  selectedReport: any = null;
  commentText = '';
  // confirmChanges = false;
  currentStatusChange: string = '';

  // Variables para el formulario de seguimiento
  showSeguimientoForm = false;
  seguimientoForm: FormGroup;
  currentSeguimientoReport: Reporte | null = null;

  // Opciones para los selects
  seguimientoOptions = ['Denegado', 'Revisado', 'Resuelto'];
  prioridadOptions = ['Baja', 'Media', 'Alta', 'Crítica'];

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private reporteService: ReportenorService,
    private comunidadService: ComunidadService,
    private seguimientoService: SeguimientoService,
    private reportecomservice: ReporteService,
    private fb: FormBuilder,
    private http: HttpClient,
    private cloudinaryService: CloudinaryService,
    private router: Router,
     private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      estado: ['', Validators.required],
      comentarios: ['', Validators.required],
    });

    this.seguimientoForm = this.fb.group({
      estadoSeguimiento: ['', Validators.required],
      prioridad: ['', Validators.required],
      acciones: ['', Validators.required],
      confirmar: [false, Validators.requiredTrue],
    });
  }

 ngOnInit(): void {
  // Cargar comunidades desde el API usando el servicio actualizado
 /* if (!this.authService.hasRole('Administrador')) {
    this.router.navigate(['/']); // Redirige a inicio o página no autorizada
    return;
  }*/
  this.seguimientoService.getAllComunidades().subscribe({
    next: (comunidades) => {
      this.comunidadesData = comunidades;
      this.cargarDatos();
    },
    error: (err) => {
      console.error('Error al cargar comunidades', err);
      this.comunidadesData = [];
      this.cargarDatos();
    }
  });
}
  aplicarFiltro() {
    if (!this.filtro) {
      this.cargarDatos();
      return;
    }

    const textoBusqueda = this.filtro.toLowerCase();

    this.dataSource = this.dataSource.filter((reporte) => {
      const coincideTitulo = reporte.titulo
        .toLowerCase()
        .includes(textoBusqueda);

      const nombreComunidad = reporte.comunidad?.nombre?.toLowerCase() || '';

      const coincideComunidad = nombreComunidad.includes(textoBusqueda);

      return coincideTitulo || coincideComunidad;
    });
  }
  cargarDatos(): void {
    this.reporteService.getReporteCompleto().subscribe((reportes: ReporteCompleto[]) => {
      this.dataSource = reportes;
    });
  }

getNombreComunidad(reporte: ReporteCompleto): string {
  return reporte.comunidad?.nombre || 'Sin comunidad';
}

  formatearFecha(create_at: string | Date | undefined): string {
    if (!create_at) return '--';
    return new Date(create_at).toLocaleDateString();
  }

cambiarEstado(reporte: Reporte, nuevoEstado: EstadoReporte): void {
    // Obtener el reporte completo primero
    this.reporteService.getReporteById(reporte.id!).subscribe({
        next: (reporteCompleto) => {
            // Actualizar solo el estado
            const reporteActualizado = {
                ...reporteCompleto,
                estado: nuevoEstado,
                update_at: new Date().toISOString()
            };

            // Enviar el reporte completo
            this.reporteService.updateReporte(reporte.id!, reporteActualizado).subscribe({
                next: () => this.cargarDatos(),
                error: (err) => console.error('Error al actualizar estado', err),
            });
        },
        error: (err) => console.error('Error al obtener reporte', err)
    });
}
  get dataFiltrada(): Reporte[] {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    if (!termino) return this.dataSource;

    return this.dataSource.filter((reporte) => {
      const titulo = reporte.titulo?.toLowerCase() || '';
      const comunidad = this.getNombreComunidad(reporte)?.toLowerCase() || '';
      return titulo.includes(termino) || comunidad.includes(termino);
    });
  }

  cambiarEstadoSelect(reporte: any, nuevoEstado: string) {
    this.selectedReport = reporte;
    this.currentStatusChange = nuevoEstado;

    this.showCommentForm = nuevoEstado !== 'Pendiente de Revision';
    if (!this.showCommentForm) {
      this.aplicarCambioEstado();
    }
  }

  aplicarCambioEstado() {
    if (!this.selectedReport || !this.currentStatusChange) return;

    const reporteActualizado = {
      ...this.selectedReport,
      estado: this.currentStatusChange as EstadoReporte,
    };
console.log('Enviando a updateReporte:', reporteActualizado);
    this.reporteService
      .updateReporte(this.selectedReport.id!, reporteActualizado)
      .subscribe({
        next: () => {
          this.seguimientoService
            .getSeguimientosByReporte(this.selectedReport.id!)
            .subscribe((seguimientos) => {
              if (seguimientos.length > 0) {
                const seguimientoExistente = seguimientos[0];

                if (!seguimientoExistente.id) {
                  console.error('El seguimiento existente no tiene ID');
                  this.cargarDatos();
                  this.resetCommentForm();
                  return;
                }

                const seguimientoActualizado: Partial<SeguimientoReporte> = {
                  ...seguimientoExistente,
                  estado_anterior: this.selectedReport.estado,
                  estado_nuevo: this.currentStatusChange,
                  comentario: this.commentText,
                  accion_realizada: 'Cambio de estado',
                 accion_recomendada: 'Revisar el reporte',
                 documentos_adjuntos:
                    this.selectedReport.documentos_adjuntos || [],
                  prioridad: PrioridadSeguimientoReporte.MEDIA,
                  update_at: new Date().toISOString(),
                };
                const seguimientoId = seguimientoExistente.id;
                this.seguimientoService
                  .update(
                    Number(seguimientoId),
                    seguimientoActualizado
                  )
                  .subscribe({
                    next: () => {
                      this.cargarDatos();
                      this.resetCommentForm();
                    },
                    error: (err) => {
                      console.error('Error al actualizar seguimiento', err);
                      this.resetCommentForm();
                    },
                  });
              } else {
                // Crear un nuevo seguimiento...
                // (mantener el código existente para crear nuevo seguimiento)
              }
            });
        },
        error: (err) => {
          console.error('Error al actualizar estado del reporte', err);
          this.resetCommentForm();
        },
      });
  }

  cancelarCambio() {
    this.selectedReport.estado = 'Pendiente de Revision';
    this.resetCommentForm();
  }

  resetCommentForm() {
    this.showCommentForm = false;
    this.commentText = '';
    this.selectedReport = null;
    this.currentStatusChange = '';
  }

  abrirFormSeguimiento(reporte: Reporte) {
    this.currentSeguimientoReport = reporte;
    this.showSeguimientoForm = true;

    this.seguimientoForm.patchValue({
      estadoSeguimiento: '',
      prioridad: 'Media',
      acciones: '',
    });
  }

  async guardarSeguimiento() {
    if (!this.seguimientoForm.valid || !this.currentSeguimientoReport) {
       console.error('Formulario inválido', this.seguimientoForm.errors);
      console.error('Formulario inválido o reporte no seleccionado');
      return;
    }

    const reporte = this.currentSeguimientoReport;
    let imageUrl: string | null | undefined = null;

    try {
      if (this.selectedImage) {
        imageUrl = await this.cloudinaryService
          .uploadImage(this.selectedImage)
          .toPromise();
      }
      this.seguimientoService.getSeguimientosByReporte(reporte.id!).subscribe({
        next: (seguimientos) => {
          if (seguimientos.length > 0) {
            const seguimientoExistente = seguimientos[0];
            const seguimientoActualizado: Partial<SeguimientoReporte> = {
              ...seguimientoExistente,
              estado_nuevo: this.seguimientoForm.value.estadoSeguimiento,
              prioridad: this.seguimientoForm.value.prioridad,
              accion_realizada: this.seguimientoForm.value.acciones,
              update_at: new Date().toISOString(),
              imagen: imageUrl || seguimientoExistente.imagen,
            };

            this.seguimientoService
              .update(
                seguimientoExistente.id!,
                seguimientoActualizado
              )
              .subscribe(/* ... */);
          } else {
            const nuevoSeguimiento: SeguimientoReporte = {
              reporte_id: reporte.id!,
              usuario_id: this.seguimientoForm.value.usuario_id || 0,
              estado_anterior: reporte.estado,
              estado_nuevo: this.seguimientoForm.value.estadoSeguimiento,
              comentario: '',
              accion_realizada: this.seguimientoForm.value.acciones,
             accion_recomendada: '',
              documentos_adjuntos: false,
              prioridad: this.seguimientoForm.value.prioridad,
              create_at: new Date().toISOString(),
              update_at: new Date().toISOString(),
              imagen: '',
            };

            this.seguimientoService
              .create(nuevoSeguimiento)
              .subscribe(/* ... */);
          }

          this.actualizarReporteDespuesDeSeguimiento(reporte);
        },
        error: (err) => console.error('Error al buscar seguimientos', err),
      });
    } catch (error) {
      console.error('Error en el proceso de guardado', error);
    }
  }

  private actualizarReporteDespuesDeSeguimiento(reporte: Reporte) {
    this.reporteService
      .updateReporte(reporte.id!, {
        id: this.currentSeguimientoReport!.id,
        comunidad_id: this.currentSeguimientoReport!.comunidad_id,
        autor_id: this.currentSeguimientoReport!.autor_id,

        titulo: this.currentSeguimientoReport!.titulo,
        contenido: this.currentSeguimientoReport!.contenido,
        anonimo: this.currentSeguimientoReport!.anonimo,
        estado: this.currentSeguimientoReport!.estado,
        estado_seguimiento: this.seguimientoForm.value.estadoSeguimiento,
        create_at: this.currentSeguimientoReport!.create_at,
        update_at: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarFormularioSeguimiento();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (err) => console.error('Error al actualizar reporte', err),
      });
  }

  cancelarEdicionSeguimiento() {
    this.cerrarFormularioSeguimiento();
  }

  private cerrarFormularioSeguimiento() {
    this.showSeguimientoForm = false;
    this.currentSeguimientoReport = null;
    this.seguimientoForm.reset();
  }

  abrirCambioEstado(reporte: Reporte) {
    this.selectedReport = reporte;
    this.currentStatusChange = reporte.estado;
    this.showCommentForm = true;
    this.commentText = '';
  }

  restablecerReporte(reporte: Reporte) {
    const confirmado = window.confirm(
      '¿Estás seguro de que deseas restablecer el estado y seguimiento a "Pendiente de Revisión"?'
    );
    if (!confirmado) return;

    const reporteActualizado: Partial<Reporte> = {
        id: reporte.id,
      estado: EstadoReporte.PENDIENTE_REVISION, // Usar el enum
      estado_seguimiento: SeguimientoReporteEnum.PENDIENTE_REVISION, // Usar el enum
      update_at: new Date().toISOString(),
    };

    this.reporteService
      .updateReporte(reporte.id!, reporteActualizado)
      .subscribe({
        next: () => this.cargarDatos(),
        error: (err) => console.error('Error al restablecer el reporte', err),
      });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  irADetalleReporte(reporte: any) {
    this.router.navigate(['/reporte', reporte.id]);
  }

  mostrarReporteIndividual(reportecom: ReporteCompleto) {
    if (reportecom.id === undefined) {
      console.error('El reporte no tiene ID');
      return;
    }
    this.reportecomservice.getReporteById(reportecom.id).subscribe({
      next: (reporteCompleto) => {
        this.reporteSeleccionado = reporteCompleto;
        this.mostrandoDetalleCompleto = true;
      },
      error: (err) => console.error('Error al cargar reporte completo', err),
    });
  }

  // Método para volver a la lista
  volverALista() {
    this.mostrandoDetalleCompleto = false;
    this.reporteSeleccionado = null;
  }
}