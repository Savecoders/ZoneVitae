import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import {
  UsuarioCompleto,
  ReporteCompleto,
  MeEncanta,
  Comunidad,
  Tag,
  Foto,
  EstadoReporte,
  SeguimientoReporteEnum,
} from '../../models';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/primitives/button/button.component';
import { MeEncantaService } from '../../services/me_encanta.service';
import { TagService } from '../../services/tag.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { ComunidadService } from '../../services/comunidad.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FollowSectionComponent } from '../shared/follow-section/follow-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, switchMap } from 'rxjs/operators';
import { of, forkJoin, Subscription } from 'rxjs';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    RouterModule,
    ButtonComponent,
    HeaderComponent,
    SidebarComponent,
    FollowSectionComponent,
    FooterComponent,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  constructor(
    private reporteService: ReporteService,
    private comunidadService: ComunidadService,
    private meEncantaService: MeEncantaService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private tagService: TagService,
    private cloudinaryService: CloudinaryService
  ) {}

  form!: FormGroup;
  isEditMode: boolean = false;
  reporteEditando: ReporteCompleto | null = null;
  reportes: ReporteCompleto[] = [];
  reportesFiltrados: ReporteCompleto[] = [];
  comunidades: Comunidad[] = [];
  usuarioActual: UsuarioCompleto | null = null;
  menuAbiertoId: number | null = null;
  meEncantaReporte: { [key: number]: boolean } = {};
  mostrarFormulario = false;
  tag: Tag[] = [];
  tagFiltrado: string | null = null;
  mostrarInput = false;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.cargarUsuarioActual();
    this.cargarComunidades();
    this.cargarReportes();
    this.reportsForm();
  }
  
cargarUsuarioActual(): void {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    const parsed = JSON.parse(userData);
    this.usuarioActual = parsed.usuario ?? parsed;
  }
}

  reportsForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      contenido: ['', [Validators.required, Validators.maxLength(280)]],
      estado: ['Pendiente_Moderacion', Validators.required],
      anonimo: [false],
      create_at: [new Date()],
      direccion: ['', Validators.maxLength(500)],
      comunidad: [null, Validators.required],
      fotos: this.fb.array([], (control: AbstractControl) => {
        const array = control as FormArray;
        return array.length > 0 ? null : { required: true };
      }),
      tags: this.fb.array(
        [],
        [
          (control: AbstractControl) => {
            const array = control as FormArray;
            return array.length > 0 ? null : { required: true };
          },
        ]
      ),
    });
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }
  get fotos(): FormArray {
    return this.form.get('fotos') as FormArray;
  }

nuevoReporte() {
  this.mostrarFormulario = true;
  this.isEditMode = false;
  this.menuAbiertoId = null;
  this.imagePreview = null;

  this.form.reset();

  this.fotos.clear();
  this.tags.clear();

  this.form.patchValue({
    estado: 'Pendiente_Moderacion',
    anonimo: false,
    create_at: new Date()
  });
}
  resetFormulario(): void {
    this.form.reset();
    this.tags.clear();
    this.fotos.clear();
    this.tag = [];
    this.isEditMode = false;
    this.reporteEditando = null;
  }

  //Cargar Comunidades
  cargarComunidades(): Subscription {
    return this.comunidadService.getComunidadesParaReportes().subscribe((datos: Comunidad[]) => {
      this.comunidades = datos;
    });
  }

  //Cargar Reporte
  cargarReportes(): void {
    this.reporteService.getReporte().subscribe((datos: ReporteCompleto[]) => {
      this.reportes = datos;
      this.reportesFiltrados = datos;
      this.reportes
        .filter((reporte) => reporte.id !== undefined)
        .forEach((reporte) => this.verificarMeEncanta(reporte.id!));
    });
  }

  puedeCrear(): boolean {
    const roles =
      this.usuarioActual?.roles?.map((r) => r.nombre.toLowerCase()) || [];
    return (
      roles.includes('administrador') ||
      roles.includes('usuario') ||
      roles.includes('moderador')
    );
  }

  //Guardar Reporte
guardarReporte(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const reportForm = this.form.value;

  // Obtener tags como string[]
  const tagsNom: string[] = this.tags.value
    .filter((t: any) => t?.nombre)
    .map((t: any) => t.nombre.trim().toLowerCase())
    .filter((nombre: string) => nombre.length > 0);

  if (tagsNom.length === 0) {
    this.toastService.error('Debes agregar al menos un tag válido');
    return;
  }

  // Obtener URLs de las fotos subidas
  const fotosUrls: string[] = this.fotos.value.map((f: any) => f.image);

  // Construir el DTO compatible con el backend (ReportCreateDto)
  const dto = {
  titulo: reportForm.titulo,
  contenido: reportForm.contenido,
  anonimo: !!reportForm.anonimo,
  Direccion: reportForm.direccion,
  ComunidadId: reportForm.comunidad?.id,
  Tags: tagsNom,
  FotosUrls: fotosUrls,
};

  const accion = this.isEditMode && this.reporteEditando
    ? this.reporteService.editReporte(this.reporteEditando.id!, dto)
    : this.reporteService.createReporte(dto);

  accion.subscribe({
    next: () => {
      this.toastService.success('¡Reporte guardado exitosamente!');
      this.resetFormulario();
      this.mostrarFormulario = false;
      this.isEditMode = false;
      this.reporteEditando = null;
      setTimeout(() => this.cargarReportes(), 100);
    },
    error: (err) => {
      console.error('Error al guardar el reporte:', err);
      this.toastService.error('Error al guardar el reporte');
    },
  });
}

  //Editar Reporte
  editarReporte(id: number): void {
    const reporte = this.reportes.find((r) => r.id === id);
    if (!reporte) return;
    
  if (!this.usuarioActual || !reporte.autor || reporte.autor.id !== this.usuarioActual.id) {
    this.toastService.error('No tienes permiso para editar este reporte.');
    return;
  }

    this.isEditMode = true;
    this.reporteEditando = reporte;
    this.mostrarFormulario = true;
    const comunidad = this.comunidades.find(
      (c) => c.id !== undefined && Number(c.id) === reporte.comunidad_id
    );

    this.form.patchValue({
      titulo: reporte.titulo,
      contenido: reporte.contenido,
      direccion: reporte.direccion,
      anonimo: reporte.anonimo,
      comunidad: comunidad ?? null,
      create_at: reporte.create_at,
      estado: reporte.estado 
    });

    this.tags.clear();
    reporte.tags?.forEach((tag) => {
      this.tags.push(this.fb.control({ nombre: tag.nombre }));
    });

    this.fotos.clear();
    if (reporte.fotos) {
      reporte.fotos.forEach((foto) => {
        this.fotos.push(this.fb.control(foto));
      });
    }
  }

  //Eliminar Reporte
  eliminarReporte(id: number): void {
    const confirmado = confirm(
      '¿Estás seguro de que deseas eliminar este reporte?'
    );

    if (confirmado) {
      this.reporteService.deleteReporte(id).subscribe({
        next: () => {
          this.cargarReportes();
          this.menuAbiertoId = null;
          this.toastService.success('Reporte eliminado correctamente');
        },
        error: (err) => {
          const msg = err.error?.message || 'Error interno al eliminar el reporte';
          this.toastService.error('Error al eliminar el reporte:', err);
        },
      });
    }
  }

  //Ver Lista de Reporte
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    console.log(
      'Formulario cancelado, mostrarFormulario =',
      this.mostrarFormulario
    );
  }

  eliminarTag(index: number): void {
    this.tags.removeAt(index);
  }

  agregarTag(nombre: string): void {
    // Validar que el nombre no sea nulo o vacío
    if (!nombre) {
      return;
    }

    const nombreNormalizado = nombre.trim().toLowerCase();
    if (
      !nombreNormalizado ||
      this.tags.length >= 5 ||
      this.tags.value.some(
        (t: Tag) =>
          t && t.nombre && t.nombre.trim().toLowerCase() === nombreNormalizado
      )
    )
      return;

    // Crear un objeto Tag correctamente conformado
    this.tags.push(this.fb.control({ nombre: nombreNormalizado }));
  }

  //Me Gusta
  verificarMeEncanta(reporteId: number): void {
    const idUsuario = localStorage.getItem('user_data')
      ? JSON.parse(localStorage.getItem('user_data')!).id
      : null;
    if (!idUsuario) return;
    this.meEncantaService
      .getUsuario_Reporte(idUsuario, reporteId)
      .subscribe((res) => {
        this.meEncantaReporte[reporteId] = res.length > 0;
      });
  }

  toggleMeGusta(reporteId: number): void {
    const idUsuario = localStorage.getItem('user_data')
      ? JSON.parse(localStorage.getItem('user_data')!).id
      : null;
    if (!idUsuario) return;
    this.meEncantaService
      .getUsuario_Reporte(idUsuario, reporteId)
      .subscribe((res) => {
        if (res.length > 0) {
          const meEncanta = res[0];
          if (meEncanta.id) {
            this.meEncantaService
              .quitarMeEncanta(meEncanta.id)
              .subscribe(() => {
                this.meEncantaReporte[reporteId] = false;
              });
          }
        } else {
          const nuevo: MeEncanta = {
            usuario_id: idUsuario,
            reports_id: reporteId,
          };
          this.meEncantaService.darMeEncanta(nuevo).subscribe(() => {
            this.meEncantaReporte[reporteId] = true;
          });
        }
      });
  }

  //Menu acciones
  toggleMenu(id: number): void {
    this.menuAbiertoId = this.menuAbiertoId === id ? null : id;
  }

  //Fotos
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          console.log('Subido a:', url);

          this.fotos.push(
            this.fb.group({
              image: [url],
              reports_id: [null],
            })
          );
        },
        error: (err) => this.toastService.error('Error al subir:', err),
      });
    }
  }

  eliminarFoto(index: number): void {
    this.fotos.removeAt(index);
  }

filtrarTag(tag: string): void {
  this.reporteService.buscarPorTag(tag).subscribe({
    next: (res) => {
      this.reportesFiltrados = res;
      this.toastService.success(`Se filtraron los reportes por el tag ${tag}`);
    },
    error: (err) => {
      console.error('Error al filtrar:', err);
      this.toastService.error('No se pudo filtrar los reportes');
    },
  });
}


  quitarFiltro() {
    this.reportesFiltrados = this.reportes;
    this.toastService.success(
      'Se limpió el filtro, mostrando todos los reportes.'
    );
  }

  compareComunidades(c1: Comunidad, c2: Comunidad): boolean {
  return c1 && c2 ? c1.id === c2.id : c1 === c2;
}
}
