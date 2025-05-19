import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { UsuarioCompleto, ReporteCompleto, MeEncanta, Comunidad, Tag, Foto, 
EstadoReporte, SeguimientoReporteEnum } from '../../models';
import { FormBuilder, FormGroup, FormArray, FormsModule, 
ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../shared/primitives/button/button.component";
import { MeEncantaService } from '../../services/me_encanta.service';
import { TagService } from '../../services/tag.service';
import { FooterComponent } from "../shared/footer/footer.component";
import { ComunidadService } from '../../services/comunidad.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FollowSectionComponent } from '../shared/follow-section/follow-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, switchMap} from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, RouterModule, ButtonComponent,HeaderComponent,SidebarComponent,FollowSectionComponent,
    FooterComponent,ReactiveFormsModule, FormsModule,MatCheckboxModule,],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  constructor(private reporteService: ReporteService,private comunidadService: ComunidadService,
    private meEncantaService: MeEncantaService,private toastService: ToastService,
    private fb: FormBuilder,private tagService: TagService,private cloudinaryService:CloudinaryService) {}

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
    this.cargarReportes();
    this.reportsForm();
    this.cargarComunidades();
  }

  reportsForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      contenido: ['', [Validators.required, Validators.maxLength(280)]],
      anonimo: [false],
      create_at: [new Date()],
      comunidad: [null, Validators.required],
      fotos: this.fb.array([], (control: AbstractControl) => {
        const array = control as FormArray;
        return array.length > 0 ? null : { required: true };}),
      tags: this.fb.array([], [(control: AbstractControl) => {
        const array = control as FormArray;
        return array.length > 0 ? null : { required: true };}])
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
  this.form.reset();
  this.fotos.clear();
  this.tags.value.map((t: Tag) => ({ id: t.id, nombre: t.nombre }))  
  this.imagePreview = null;
  this.menuAbiertoId = null;
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
  cargarComunidades(): void {
    this.comunidadService.getComunidades().subscribe((datos: Comunidad[]) => {
      this.comunidades = datos;
    });
  }

  //Cargar Reporte
  cargarReportes(): void {
    this.reporteService.getReporte().subscribe((datos: ReporteCompleto[]) => {
      this.reportes = datos;
      this.reportesFiltrados = datos;
      this.reportes
        .filter(reporte => reporte.id !== undefined)
        .forEach(reporte => this.verificarMeEncanta(reporte.id!));
    });
  }

  puedeCrear(): boolean {
    const roles = this.usuarioActual?.roles?.map(r => r.nombre.toLowerCase()) || [];
    return roles.includes('administrador') || roles.includes('usuario')|| roles.includes('moderador');
  }

  //Guardar Reporte
  guardarReporte(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const reportForm = this.form.value;
    const tagsNom: string[] = reportForm.tags
      .map((t: any) => (t.nombre as string).trim().toLowerCase())
      .filter((nombre: string) => nombre.length > 0);
  
    const tagsCreacion$ = tagsNom.map((nombre: string) =>
      this.tagService.getTags().pipe(
        map(tags => tags.find(tag => tag.nombre.toLowerCase() === nombre)),
        switchMap(tagExistente => {
          if (tagExistente) {
            return of(tagExistente);
          } else {
            return this.tagService.createTag({ nombre });
          }
        })
      )
    );
  
    forkJoin(tagsCreacion$).subscribe({
      next: (tagsCreadoOExistentes: Tag[]) => {
        const nuevoReporte: ReporteCompleto = {
          id: this.reporteEditando?.id,
          titulo: reportForm.titulo,
          contenido: reportForm.contenido,
          anonimo: reportForm.anonimo,
          create_at: reportForm.create_at || new Date(),
          comunidad: reportForm.comunidad,
          fotos: this.fotos.value as Foto[],
          tags: tagsCreadoOExistentes, 
          estado: EstadoReporte.PENDIENTE_REVISION,
          estado_seguimiento: SeguimientoReporteEnum.PENDIENTE_REVISION,
        };
  
        if (this.isEditMode && this.reporteEditando) {
          this.reporteService.editReporte(nuevoReporte).subscribe(() => {
            this.cargarReportes();
            this.resetFormulario();
            this.mostrarFormulario = false;
            this.isEditMode = false;
            this.reporteEditando = null;
            this.toastService.success('¡Reporte guardado exitosamente!');
          });
        } else {
          this.reporteService.createReporte(nuevoReporte).subscribe(() => {
            this.cargarReportes();
            this.resetFormulario();
            this.mostrarFormulario = false;
            this.toastService.success('¡Reporte guardado exitosamente!');
          });
        }
      },
      error: (err) => {
        console.error('Error creando tags:', err);
      }
    });
  }
    //Editar Reporte
    editarReporte(id: number): void {
      const reporte = this.reportes.find(r => r.id === id);
      if (!reporte) return;
    
      this.isEditMode = true;
      this.reporteEditando = reporte;
      this.mostrarFormulario = true;
      const comunidad = this.comunidades.find(c => c.id === reporte.comunidad?.id);
    
      this.form.patchValue({
        titulo: reporte.titulo,
        contenido: reporte.contenido,
        anonimo: reporte.anonimo,
        comunidad: comunidad ?? null,
        create_at: reporte.create_at,
      });
    
      this.tags.clear();
      reporte.tags?.forEach(tag => {
        this.tags.push(this.fb.control({ nombre: tag.nombre }));    
      });
    
      this.fotos.clear();
      if (reporte.fotos) {
        reporte.fotos.forEach(foto => {
          this.fotos.push(this.fb.control(foto));
        });
      }
    }
  
  //Eliminar Reporte
  eliminarReporte(id: number): void {
    const confirmado = confirm("¿Estás seguro de que deseas eliminar este reporte?");
    
    if (confirmado) {
      this.reporteService.deleteReporte(id).subscribe({
        next: () => {
          this.cargarReportes();
          this.menuAbiertoId = null;
          this.toastService.success('Reporte eliminado correctamente');
        },
        error: (err) => {
          this.toastService.error('Error al eliminar el reporte:', err);
        }
      });
    }

  } 


  //Ver Lista de Reporte
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    console.log('Formulario cancelado, mostrarFormulario =', this.mostrarFormulario);

  }

  eliminarTag(index: number): void {
    this.tags.removeAt(index);
  }
  
  agregarTag(nombre: string): void {
    const nombreNormalizado = nombre.trim().toLowerCase();
    if (
      !nombreNormalizado ||
      this.tags.length >= 5 ||
      this.tags.value.some((t: Tag) => t.nombre.trim().toLowerCase() === nombreNormalizado)
    ) return;
  
    this.tags.push(this.fb.control({ nombre: nombreNormalizado }));
  }


    //Me Gusta
    verificarMeEncanta(reporteId: number): void {
      const idUsuario = this.usuarioActual?.id;
      if (!idUsuario) return;
      this.meEncantaService.getUsuario_Reporte(idUsuario, reporteId).subscribe(res => {
        this.meEncantaReporte[reporteId] = res.length > 0;
      });
    }
  
    toggleMeGusta(reporteId: number): void {
      const idUsuario = this.usuarioActual?.id;
      if (!idUsuario) return;
      this.meEncantaService.getUsuario_Reporte(idUsuario, reporteId).subscribe(res => {
        if (res.length > 0) {
          const meEncanta = res[0];
          if (meEncanta.id) {
            this.meEncantaService.quitarMeEncanta(meEncanta.id).subscribe(() => {
              this.meEncantaReporte[reporteId] = false;
            });
          }
        } else {
          const nuevo: MeEncanta = {
            usuario_id: idUsuario,
            reports_id: reporteId
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
                reports_id: [null]
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
    this.reportesFiltrados = this.reportes.filter(r =>
      Array.isArray(r.tags) &&
      r.tags.some(t => t.nombre.toLowerCase() === tag.toLowerCase())
    );
    this.toastService.success(`Se filtraron los reportes por el tag ${tag}`);

  }

  quitarFiltro() {
  this.reportesFiltrados = this.reportes;
  this.toastService.success('Se limpió el filtro, mostrando todos los reportes.');
  }

}
