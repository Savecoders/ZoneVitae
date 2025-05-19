import { Component } from '@angular/core';
import { LayoutComponent } from "../shared/layout/layout.component";
import { FooterComponent } from "../shared/footer/footer.component";
import {MatTableModule} from '@angular/material/table';
import { CardComponent } from '../shared/primitives';
import { LucideAngularModule, FileSearch, TicketPlusIcon } from 'lucide-angular';
import { Reporte ,EstadoReporte,SeguimientoReporteEnum, PrioridadSeguimientoReporte, SeguimientoReporte } from '../../models';
import{ReporteService}from '../../services/reporte.service';
import { ComunidadService } from '../../services/comunidad.service';
import { Comunidad } from '../../models';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { SeguimientoService } from '../../services/seguimiento.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { InputComponent } from '../shared/primitives';

@Component({
  selector: 'app-auditoria',
  imports: [LayoutComponent,  LucideAngularModule, MatTableModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSelectModule, FooterComponent,MatDialogModule ,CardComponent, CommonModule, MatCheckboxModule],
  standalone: true,
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent  {
  readonly FileSearch = FileSearch;
  
  displayedColumns: string[] = ['titulo', 'comunidad', 'fecha', 'estado', 'seguimiento', 'acciones'];
  dataSource: Reporte[] = [];
  comunidades: Comunidad[] = [];
  loading = true;
  filtroBusqueda: string = '';
  filtro: string = '';


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
    private reporteService: ReporteService,
    private comunidadService: ComunidadService ,
      private seguimientoService: SeguimientoService,
  private fb: FormBuilder,
  private http: HttpClient,
  private cloudinaryService: CloudinaryService
  
  ) {
    this.editForm = this.fb.group({
      estado: ['', Validators.required],
      comentarios:['', Validators.required],
    });

     this.seguimientoForm = this.fb.group({
      estadoSeguimiento: ['', Validators.required],
      prioridad: ['', Validators.required],
      acciones: ['', Validators.required],
      confirmar: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.http.get<any>('../preview/data.json').subscribe(data => {
      this.comunidadesData = data.comunidades;
      this.cargarDatos(); // Ahora cargamos servicios después de tener el JSON
    });
  }
 aplicarFiltro() {
    if (!this.filtro) {
      this.cargarDatos(); // Si no hay filtro, recargamos todos los datos
      return;
    }

    const textoBusqueda = this.filtro.toLowerCase();
    
    this.dataSource = this.dataSource.filter(reporte => {
      // Buscar en el título
      const coincideTitulo = reporte.titulo.toLowerCase().includes(textoBusqueda);
      
      // Buscar en el nombre de la comunidad
      const nombreComunidad = this.getNombreComunidad(reporte.comunidad_id).toLowerCase();
      const coincideComunidad = nombreComunidad.includes(textoBusqueda);
      
      return coincideTitulo || coincideComunidad;
    });
  }
   cargarDatos(): void {
    this.reporteService.getReportes().subscribe(reportes => {
      this.dataSource = reportes.map(reporte => ({
        ...reporte,
        nombreComunidad: this.getNombreComunidad(reporte.comunidad_id)
      }));
    });
  }

 getNombreComunidad(comunidadId: number | null | undefined): string {
  if (!comunidadId) return 'Sin comunidad';
  const comunidad = this.comunidadesData?.find((c: any) => 
    Number(c.id) === Number(comunidadId)
  );
  return comunidad?.nombre || 'Comunidad desconocida';
}

  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '--';
    return new Date(fecha).toLocaleDateString();
  }

  cambiarEstado(reporte: Reporte, nuevoEstado: EstadoReporte): void {
    this.reporteService.updateReporte(reporte.id!, { estado: nuevoEstado })
      .subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => console.error('Error al actualizar estado', err)
      });
  }

  get dataFiltrada(): Reporte[] {
  const termino = this.filtroBusqueda.toLowerCase().trim();
  if (!termino) return this.dataSource;

  return this.dataSource.filter(reporte => {
    const titulo = reporte.titulo?.toLowerCase() || '';
    const comunidad = this.getNombreComunidad(reporte.comunidad_id)?.toLowerCase() || '';
    return titulo.includes(termino) || comunidad.includes(termino);
  });
}

 
  cambiarEstadoSelect(reporte: any, nuevoEstado: string) {
    this.selectedReport = reporte;
    this.currentStatusChange = nuevoEstado;
    
    // Mostrar formulario solo si no es "Pendiente de Revision"
    this.showCommentForm = nuevoEstado !== 'Pendiente de Revision';
    
    // Si es Pendiente de Revision, aplicar cambios directamente
    if (!this.showCommentForm) {
      this.aplicarCambioEstado();
    }
  }

// Método para aplicar el cambio de estado
aplicarCambioEstado() {
/*
if (!this.editForm.valid) {
    this.editForm.markAllAsTouched();
    return;
  }*/

  if (!this.selectedReport || !this.currentStatusChange) return;

  const reporteActualizado = { 
    ...this.selectedReport, 
    estado: this.currentStatusChange as EstadoReporte 
  };

  // Primero actualizamos el reporte
  this.reporteService.updateReporte(this.selectedReport.id!, reporteActualizado)
    .subscribe({
      next: () => {
        // Buscar seguimientos existentes usando el servicio de seguimiento
        this.seguimientoService.getSeguimientosByReporte(this.selectedReport.id!)
          .subscribe(seguimientos => {
            if (seguimientos.length > 0) {
              // Actualizar el primer seguimiento encontrado
              const seguimientoExistente = seguimientos[0];
              
              // Verificar que el seguimiento tiene ID
              if (!seguimientoExistente.id) {
                console.error('El seguimiento existente no tiene ID');
                this.cargarDatos();
                this.resetCommentForm();
                return;
              }

              const seguimientoActualizado: Partial<SeguimientoReporte> = {
  ...seguimientoExistente, // Incluye todos los campos originales
  estado_anterior: this.selectedReport.estado,
  estado_nuevo: this.currentStatusChange,
  comentario: this.commentText,
  accion_realizada: 'Cambio de estado',
  accion_recomendada: 'Revisar el reporte',
  documentos_adjuntos: this.selectedReport.documentos_adjuntos || [],
  prioridad: PrioridadSeguimientoReporte.MEDIA,
  update_at: new Date().toISOString()
  // No cambies create_at ni id si no es necesario
};
              
              // Convertir el ID a string (según tu servicio)
              const seguimientoId = seguimientoExistente.id;
              
              this.seguimientoService.updateSeguimiento(
                Number(seguimientoId), 
                seguimientoActualizado
              ).subscribe({
                next: () => {
                  this.cargarDatos();
                  this.resetCommentForm();
                },
                error: (err) => {
                  console.error('Error al actualizar seguimiento', err);
                  this.resetCommentForm();
                }
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
      }
    });
}
  // Método para cancelar el cambio
  cancelarCambio() {
    // Revertir al estado anterior
    this.selectedReport.estado = 'Pendiente de Revision';
    this.resetCommentForm();
  }

  // Método para resetear el formulario
  resetCommentForm() {
    this.showCommentForm = false;
    this.commentText = '';
    //this.confirmChanges = false;
    this.selectedReport = null;
    this.currentStatusChange = '';
  }

 abrirFormSeguimiento(reporte: Reporte) {
   this.currentSeguimientoReport = reporte;
   this.showSeguimientoForm = true;

   // Aquí NO uses reporte.prioridad ni reporte.acciones_realizadas
  
  this.seguimientoForm.patchValue({
    estadoSeguimiento: '', 
    prioridad: 'Media',
    acciones: ''
  });
 }

async guardarSeguimiento() {
  if (this.seguimientoForm.valid && this.currentSeguimientoReport) {
    let imageUrl = null;
    
    // Subir imagen si existe
    if (this.selectedImage) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(this.selectedImage).toPromise();
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        return; // Detener el proceso si falla la subida
      }
    }

    // Buscar el seguimiento existente por reporte_id
    this.seguimientoService.getSeguimientosByReporte(this.currentSeguimientoReport.id!)
      .subscribe(seguimientos => {
        if (seguimientos.length > 0) {
          const seguimientoExistente = seguimientos[0];

          // Mezcla los campos originales con los nuevos valores del formulario
          const seguimientoActualizado: Partial<SeguimientoReporte> = {
            ...seguimientoExistente,
            estado_nuevo: this.seguimientoForm.value.estadoSeguimiento,
            prioridad: this.seguimientoForm.value.prioridad,
            accion_realizada: this.seguimientoForm.value.acciones,
            update_at: new Date().toISOString(),
            imagen: imageUrl || seguimientoExistente.imagen // Mantener la anterior si no hay nueva
          };

          // Resto del código permanece igual...
          this.seguimientoService.updateSeguimiento(
            seguimientoExistente.id!,
            seguimientoActualizado
          ).subscribe({
            next: () => {
              // Actualizar el reporte
              this.reporteService.updateReporte(
                this.currentSeguimientoReport!.id!,
                { 
                 id: this.currentSeguimientoReport!.id,
                  comunidad_id: this.currentSeguimientoReport!.comunidad_id,
                  autor_id: this.currentSeguimientoReport!.autor_id,
                  
                  titulo: this.currentSeguimientoReport!.titulo,
                  contenido: this.currentSeguimientoReport!.contenido,
                  anonimo: this.currentSeguimientoReport!.anonimo,
                  estado: this.currentSeguimientoReport!.estado,
                  estado_seguimiento: this.seguimientoForm.value.estadoSeguimiento,
                  create_at: this.currentSeguimientoReport!.create_at,
                update_at: new Date().toISOString()
                }
              ).subscribe({
                next: () => {
                  this.cargarDatos();
                  this.cerrarFormularioSeguimiento();
                  this.selectedImage = null;
                  this.imagePreview = null;
                },
                error: (err) => console.error(err)
              });
            },
            error: (err) => console.error(err)
          });
        } else {
          // Lógica para crear nuevo seguimiento si no existe
        }
      });
  }
}
  // Método para cancelar la edición
  cancelarEdicionSeguimiento() {
    this.cerrarFormularioSeguimiento();
  }

  // Método privado para cerrar el formulario
  private cerrarFormularioSeguimiento() {
    this.showSeguimientoForm = false;
    this.currentSeguimientoReport = null;
    this.seguimientoForm.reset();
  }

  abrirCambioEstado(reporte: Reporte) {
  this.selectedReport = reporte;
  this.currentStatusChange = reporte.estado; // valor actual por defecto
  this.showCommentForm = true;
  this.commentText = '';
}

   restablecerReporte(reporte: Reporte) {
  const confirmado = window.confirm('¿Estás seguro de que deseas restablecer el estado y seguimiento a "Pendiente de Revisión"?');
  if (!confirmado) return;

  const reporteActualizado: Partial<Reporte> = {
    ...reporte,
    estado: EstadoReporte.PENDIENTE_REVISION,  // Usar el enum
    estado_seguimiento: SeguimientoReporteEnum.PENDIENTE_REVISION,  // Usar el enum
    update_at: new Date().toISOString()
  };

  this.reporteService.updateReporte(reporte.id!, reporteActualizado)
    .subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error('Error al restablecer el reporte', err)
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

}