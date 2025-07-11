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
    
    constructor(private miServicio:ComunidadService, private servTags:TagService,
      private formBuild:FormBuilder, private cloudinaryService: CloudinaryService,
      private router: Router, private route: ActivatedRoute, private servTag:TagService,
      private toastService: ToastService){}

    estadosComunidad = Object.entries(EstadoComunidad).map(([key, value]) => ({
      value: key,    
      label: value   
    }));

    tiposComunidades = Object.entries(TipoComunidad).map(([key, value]) => ({
      value: key,    
      label: value   
    }));

    fileInputs: { [key: string]: File | null } = {
      logo: null,
      cover: null
    };

    uploadedUrls: { [key: string]: string } = {
      logo: '',
      cover: ''
    };


    ngOnInit(): void {
      this.cargarTags();
      this.formGroup = this.formBuild.group({
        nombre:["", [Validators.required, Validators.minLength(10)]],
        descripcion:["", [Validators.required, Validators.minLength(10)]],
        ubicacion:["", [Validators.required, Validators.minLength(10)]],
        logo:[this.uploadedUrls['logo']],
        cover: [this.uploadedUrls['cover']],
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
        this.servTags.getTags().subscribe((datos:Tag[])=>{
          this.tags = datos;
        });
    }

    clearForm() {
    this.formGroup.reset({
      nombre:"",
      descripcion:"",
      ubicacion:"",
      logo:"",
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
          this.servTags.getTags(),
          this.miServicio.getComunidadById(this.currentId)
        ]).subscribe(([tags, comunidad]) => {
          this.tags = tags;

          //Buscar los objetos completos de los tags seleccionados
          let tagsSeleccionados = tags.filter(tag =>
            (comunidad.tags ?? []).some((t: any) => t.id ? t.id === tag.id : t === tag.id)
          );

          //Actualizar valores del formulario
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
          this.uploadedUrls['logo'] = comunidad.logo || '';
          this.uploadedUrls['cover'] = comunidad.cover || '';
          this.titulo = "Editar comunidad";
        });
      }
    }

    onSubmit() {
      if(this.formGroup.invalid){
        this.formGroup.markAllAsTouched();
        return;
      }
      this.formGroup.get('logo')?.setValue(this.uploadedUrls['logo']);
      this.formGroup.get('cover')?.setValue(this.uploadedUrls['cover']);
      let newComunidad:Comunidad = this.formGroup.value;
      if(this.isEditMode){ 
        newComunidad.id = this.currentId;
        this.formGroup.get('update_at')?.setValue(new Date());
        this.miServicio.updateComunidad(newComunidad.id,newComunidad).subscribe((updateComunidad)=>{
          this.toastService.success("La comunidad ha sido actualizada");
          this.router.navigate(['/crud-communities']);
        });
      }else{ 
        const now = new Date();
        this.formGroup.get('create_at')?.setValue(now);
        this.formGroup.get('update_at')?.setValue(now);
        this.miServicio.createComunidad(newComunidad).subscribe((addComunidad)=>{
        this.toastService.success("La comunidad ha sido creada");
        this.router.navigate(['/crud-communities']);
        });
      }
      this.clearForm(); 
    }

    onFileSelected(event: Event, field: 'logo' | 'cover'): void {
      let fileInput = event.target as HTMLInputElement;
      let file = fileInput.files?.[0];
      if (file) {
        this.fileInputs[field] = file;
      }
    }

    uploadFile(field: 'logo' | 'cover'): void {
      let file = this.fileInputs[field];
      if (!file) return;

      this.cloudinaryService.uploadImage(file).subscribe({
        next: (res) => {
          this.uploadedUrls[field] = res;
          this.formGroup.get(field)?.setValue(res);
          alert(`${field} subido correctamente`);
        },
        error: (err) => {
          console.error(`Error al subir ${field}:`, err);
        }
      });
    }

    cancelar() {
    if (this.isEditMode) {
      this.router.navigate(['/crud-communities']);
    } else {
      this.clearForm();
    }
  }

}
