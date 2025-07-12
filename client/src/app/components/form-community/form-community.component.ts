import { Component } from '@angular/core';
import { LayoutComponent } from "../shared/layout/layout.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../shared/primitives/input/input.component";
import { ToggleComponent } from "../shared/primitives/toggle/toggle.component";
import { ComunidadService } from '../../services/comunidad.service';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/tag.model';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'; 
import { ButtonComponent } from '../shared/primitives/button/button.component';
import { Comunidad, EstadoComunidad, TipoComunidad } from '../../models/comunidad.model';
import {MatRadioModule} from '@angular/material/radio';
import { CloudinaryService } from 'app/services/cloudinary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Save, CircleX, ImageUp} from 'lucide-angular';
import { ToastService } from 'app/services/toast.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-form-community',
  imports: [NgIf, NgFor, LayoutComponent, InputComponent, ReactiveFormsModule,
    ToggleComponent, MatSelectModule, MatFormFieldModule,
    MatInputModule, MatOptionModule, ButtonComponent, MatRadioModule, LucideAngularModule],
  templateUrl: './form-community.component.html',
  styleUrl: './form-community.component.css'
})
export class FormCommunityComponent {
    titulo:string = "Crear comunidad";
    formGroup!:FormGroup;
    isEditMode:boolean = false;
    currentId!:string;
    tags:Tag[]=[];
    estado:EstadoComunidad = EstadoComunidad.POR_APROBAR;
    tipoComunidad:TipoComunidad = TipoComunidad.PUBLICA;
    
    public guardar = Save;
    public cancel = CircleX;
    public upload = ImageUp;
    public userId: string | null = null;
    
    constructor(private miServicio:ComunidadService, private servTags:TagService,
      private formBuild:FormBuilder, private cloudinaryService: CloudinaryService,
      private router: Router, private route: ActivatedRoute, private servTag:TagService,
      private toastService: ToastService,
      public auth: AuthService){}

    estadosComunidad = Object.entries(EstadoComunidad).map(([key, value]) => ({
      value: value,   
      label: value   
    }));

    tiposComunidades = Object.values(TipoComunidad).map(value => ({
      value: value,   
      label: value
    }));

    fileInputs: { [key: string]: File | null } = {
      logo: null,
      cover: null
    };

    previewUrls: { [key: string]: string } = {};

    ngOnInit(): void {
      this.userId = this.auth.getUserIdFromCurrentToken();
      this.cargarTags();
      this.formGroup = this.formBuild.group({
        nombre:["", [Validators.required, Validators.minLength(10)]],
        descripcion:["", [Validators.required, Validators.minLength(10)]],
        ubicacion:["", [Validators.required, Validators.minLength(10)]],
        logo:[this.previewUrls['logo']],
        cover: [this.previewUrls['cover']],
        tipoComunidad:["", Validators.required],
        soloMayoresEdad:[false],
        tags: [[], Validators.required],
        estado: [EstadoComunidad.POR_APROBAR],
        create_at: [new Date()],
        update_at: [new Date()]
      });
      this.editar();
    }

    cargarTags():void{
        this.servTags.getAll().subscribe((datos:Tag[])=>{
          this.tags = datos;
        });
    }

    esCreador(comunidad: Comunidad): boolean {
      return String(comunidad.creadorId) === String(this.userId);
    }

    clearForm() {
    this.formGroup.reset({
      nombre:"",
      descripcion:"",
      ubicacion:"",
      logo:"",
      cover:"",
      tipoComunidad:"",
      soloMayoresEdad:false,
      tags: [],
      estado: EstadoComunidad.POR_APROBAR,
      create_at: new Date(),
      update_at: new Date()
    });
    this.isEditMode = false;
    this.currentId = "0";
    }

    editar() {
      let id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentId = id;

        forkJoin([
          this.servTags.getAll(),
          this.miServicio.getById(this.currentId)
        ]).subscribe(([tags, comunidad]) => {
          this.tags = tags;

          //Buscar los objetos completos de los tags seleccionados
          let tagsSeleccionados = tags.filter(tag =>
            (comunidad.tags ?? []).some((t: any) => t.id ? t.id === tag.id : t === tag.id)
          );

          //Actualiza valores del formulario
          this.formGroup.patchValue({
            nombre: comunidad.nombre,
            descripcion: comunidad.descripcion,
            ubicacion: comunidad.ubicacion,
            tipoComunidad: comunidad.tipoComunidad,
            soloMayoresEdad: comunidad.soloMayoresEdad,
            tags: tagsSeleccionados,
            estado: comunidad.estado,
            logo: comunidad.logo || '',
            cover: comunidad.cover || '',
            create_at: comunidad.create_at ? new Date(comunidad.create_at) : new Date(),
            update_at: comunidad.update_at ? new Date(comunidad.update_at) : new Date()
          });
          this.previewUrls['logo'] = comunidad.logo || '';
          this.previewUrls['cover'] = comunidad.cover || '';
          this.titulo = "Editar comunidad";
        });
      }
    }

    onSubmit() {
      if (this.formGroup.invalid) {
        this.formGroup.markAllAsTouched();
        return;
      }

      const formData = new FormData();
      const values = this.formGroup.value;

      formData.append('nombre', values.nombre);
      formData.append('descripcion', values.descripcion);
      formData.append('ubicacion', values.ubicacion);
      formData.append('tipoComunidad', values.tipoComunidad);
      formData.append('soloMayoresEdad', values.soloMayoresEdad.toString());
      formData.append('estado', values.estado);

      values.tags.forEach((tag: any, index: number) => {
        const tagId = typeof tag === 'object' ? tag.id : tag;  
        formData.append(`tags[${index}]`, tagId);
      });

      if (this.fileInputs['logo']) {
        formData.append('logo', this.fileInputs['logo']);
      }
      if (this.fileInputs['cover']) {
        formData.append('cover', this.fileInputs['cover']);
      }

      if (this.isEditMode) {
        this.miServicio.update(this.currentId, formData).subscribe({
          next: (comunidadActualizada: Comunidad) => {
            this.toastService.success("La comunidad ha sido actualizada");
            const creadorId = comunidadActualizada?.creadorId;
            if(this.auth.isLoggedIn() && (this.auth.hasRole('Administrador') 
              || this.esCreador(comunidadActualizada))){
                this.router.navigate(['/crud-communities']);
            } else {
              this.router.navigate(['/comunities']);
            }
          },
          error: (err) => {
            this.toastService.error("Error al actualizar comunidad");
            console.error(err);
          }
        });
      } else {
        this.miServicio.create(formData).subscribe({
          next: (comunidadCreada: Comunidad) => {
            this.toastService.success("La comunidad ha sido creada");
            const creadorId = comunidadCreada?.creadorId;
            if(this.auth.isLoggedIn() && (this.auth.hasRole('Administrador')
            || this.esCreador(comunidadCreada))){
              this.router.navigate(['/crud-communities']);
            }else{
              this.router.navigate(['/comunities']);
            }
          },
          error: (err) => {
            this.toastService.error("Error al crear comunidad");
            console.error(err);
          }
        });
      }
    }

    onFileSelected(event: Event, field: 'logo' | 'cover'): void {
      let fileInput = event.target as HTMLInputElement;
      let file = fileInput.files?.[0];
      if (file) {
        this.fileInputs[field] = file;
        this.previewUrls[field] = URL.createObjectURL(file);
      }
    }

    cancelar() {
    if (this.isEditMode && this.auth.isLoggedIn()) {
      this.router.navigate(['/crud-communities']);
    } else {
      this.clearForm();
    }
  }
}
