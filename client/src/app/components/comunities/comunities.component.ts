import { Component } from '@angular/core';
import { LayoutComponent } from "../shared/layout/layout.component";
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../shared/primitives';
import { ComunidadService } from '../../services/comunidad.service';
import { Comunidad } from '../../models/comunidad.model';
import { Router } from '@angular/router';
import { LucideAngularModule, UsersRoundIcon, LayoutDashboard } from 'lucide-angular';


@Component({
  selector: 'app-comunities',
  imports: [LayoutComponent, UpperCasePipe, MatCardModule, MatIconModule, 
    ButtonComponent, NgIf, NgFor, LucideAngularModule],
  templateUrl: './comunities.component.html',
  styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
    title:string = "Lista de comunidades";
    communities:Comunidad[] = [];
    public group = UsersRoundIcon;
    public dashboard = LayoutDashboard;
  
    constructor(private miServicio:ComunidadService, private router:Router){}
  
    ngOnInit():void{
      this.getComunidades();
    }
  
    getComunidades():void{
      this.miServicio.getComunidades().subscribe((data:Comunidad[])=>{
        this.communities = data;
      });
    }
  
    seguirComunidad() {
      
    }
    
    activar(img:HTMLImageElement){
      img.classList.add("activa");
    }

    desactivar(img:HTMLImageElement){
      img.classList.remove("activa");
    }

    frmRegistrar() {
      this.router.navigate(['/form-communities']);
    }

    admComunidades() {
      this.router.navigate(['/crud-communities']);
    }

}
