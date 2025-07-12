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
import { AuthService } from 'app/services/auth.service';


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
    public userId: string | null = null;
    public esCreadorDeUnaComunidad: boolean = false;
  
    constructor(private miServicio:ComunidadService, 
      private router:Router, public auth: AuthService){}
  
    ngOnInit():void{
      this.userId = this.auth.getUserIdFromCurrentToken();
      this.getComunidades();
    }
    
    getComunidades():void{
      this.miServicio.getAll().subscribe((data:Comunidad[])=>{
      this.communities = data;
        if (this.userId) {
          this.esCreadorDeUnaComunidad = data.some(c => c.creadorId === this.userId);
        }
      });
    }
    
    activar(img:HTMLImageElement){
      img.classList.add("activa");
    }

    desactivar(img:HTMLImageElement){
      img.classList.remove("activa");
    }

    frmRegistrar() {
      if(this.auth.isLoggedIn()) {
        this.router.navigate(['/form-communities']);
      } else {
        this.router.navigate(['communities']);
      }
    }

    admComunidades() {
      if(this.auth.isLoggedIn() && this.auth.hasRole(('Administrador'))
         || this.esCreadorDeUnaComunidad){
        this.router.navigate(['/crud-communities']);
      } else {
        this.router.navigate(['communities']);
      }
    }

}
