import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LayoutComponent } from "../shared/layout/layout.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ButtonComponent } from '../shared/primitives';
import { Comunidad } from '../../models/comunidad.model';
import { ComunidadService } from '../../services/comunidad.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from "../shared/primitives/input/input.component";
import { NgIf, TitleCasePipe } from '@angular/common';
import { LucideAngularModule, UsersRoundIcon, Pencil, Trash2 } from 'lucide-angular';
import { ToastService } from 'app/services/toast.service';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-crud-comunities',
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, ButtonComponent,
    MatFormFieldModule, MatInputModule, MatIconModule, InputComponent, 
    TitleCasePipe, LucideAngularModule, NgIf],
  templateUrl: './crud-communities.component.html',
  styleUrl: './crud-communities.component.css'
})
export class CrudComunitiesComponent implements OnInit, AfterViewInit{
displayedColumns: string[] = ['nombre', 'descripcion', 'tipoComunidad',
     'ubicacion', 'actions'];
  dataSource = new MatTableDataSource<Comunidad>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public group = UsersRoundIcon;
  public edit = Pencil;
  public delete = Trash2;
  public userId: string | null = null;

 constructor(private miServicio:ComunidadService, private router:Router, 
  private toastService: ToastService, public auth: AuthService){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.userId = this.auth.getUserIdFromCurrentToken();
    this.cargarComunidades();
  }

  cargarComunidades(): void {
    const esAdministrador = this.auth.hasRole('Administrador');
    const observable = esAdministrador
    ? this.miServicio.getAll()
    : this.miServicio.getCommunitiesByCreador();

    observable.pipe(take(1)).subscribe({
      next: (datos: Comunidad[]) => {
        if (!esAdministrador && datos.length === 0) {
          this.toastService.show("No tienes comunidades creadas.");
        }
        this.dataSource.data = datos;
      },
      error: (error) => {
        this.toastService.error("Error al cargar las comunidades.");
        this.dataSource.data = [];
        console.error(error);
      }
    });
  }

  esCreador(comunidad: Comunidad): boolean {
    return String(comunidad.creadorId) === String(this.userId);
  }

  eliminar(comunidad:Comunidad) {
    if(comunidad.id == null){
      this.toastService.error("No se pudo realizar la eliminación");
      return;
    }
    let confirmado = confirm(`Estas seguro de eliminar la comunidad ${comunidad.nombre} ?`);
    if(confirmado){
      this.miServicio.delete(comunidad.id).subscribe(() => {
        this.toastService.success("Eliminado exitosamente");
        this.cargarComunidades();
      });
    }
  }

  editar(comunidad:Comunidad){
    if (comunidad.id && this.auth.isLoggedIn() && (this.auth.hasRole('Administrador')
      || comunidad.creadorId === this.userId)) {
      this.router.navigate(['/form-communities', comunidad.id]);
    } else {
       this.router.navigate(['/comunities']);
    }
  }

  frmRegistrar() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/form-communities']);
    } else {
      this.router.navigate(['/comunities']);
    }
  }

  search(nombre?: string) {
    if (nombre) {
      this.miServicio.search(nombre).subscribe((response) => {
      this.dataSource.data = response.data;
    });
    } else {
      this.cargarComunidades();
    }
  }  
}
