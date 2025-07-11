import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LayoutComponent } from "../shared/layout/layout.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ButtonComponent } from '../shared/primitives';
import { Comunidad } from '../../models/comunidad.model';
import { ComunidadService } from '../../services/comunidad.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from "../shared/primitives/input/input.component";
import { TitleCasePipe } from '@angular/common';
import { LucideAngularModule, UsersRoundIcon, Pencil, Trash2 } from 'lucide-angular';
import { ToastService } from 'app/services/toast.service';


@Component({
  selector: 'app-crud-comunities',
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, ButtonComponent,
    MatFormFieldModule, MatInputModule, MatIconModule, InputComponent, 
    TitleCasePipe, LucideAngularModule],
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

 constructor(private miServicio:ComunidadService, private router:Router, 
  private toastService: ToastService){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.cargarComunidades();
  }

  cargarComunidades():void{
    this.miServicio.getComunidades().subscribe((datos:Comunidad[])=>{
      this.dataSource.data = datos;
    });
  }

  eliminar(comunidad:Comunidad) {
    if(comunidad.id == null){
      this.toastService.error("No se pudo realizar la eliminación");
      return;
    }
    let confirmado = confirm(`Estas seguro de eliminar la comunidad ${comunidad.nombre} ?`);
    if(confirmado){
      this.miServicio.deleteComunidad(comunidad.id).subscribe(() => {
        this.toastService.success("Eliminado exitosamente");
        this.cargarComunidades();
      });
    }
  }

  editar(comunidad:Comunidad){
    if (comunidad.id) {
      this.router.navigate(['/form-communities', comunidad.id]);
    }
  }

  frmRegistrar() {
    this.router.navigate(['/form-communities']);
  }

  search(termino: string) {
    if (termino) {
      this.miServicio.getComunidades(termino).subscribe((datos: Comunidad[]) => {
      this.dataSource.data = datos;
    });
    } else {
      this.cargarComunidades();
    }
  }  
}
