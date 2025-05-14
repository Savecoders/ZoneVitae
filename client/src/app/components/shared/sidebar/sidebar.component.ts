import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../primitives/card/card.component';
import { SeparatorComponent } from '../primitives/separator/separator.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, CardComponent, SeparatorComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  topics = [
    { id: 1, name: 'Home', slug: 'environment' },
    { id: 1, name: 'Explorar', slug: 'environment' },
    { id: 1, name: 'Comunidades', slug: 'environment' },
    { id: 2, name: 'Reportes', slug: 'technology' },
    { id: 3, name: 'Actividades', slug: 'health' },
    { id: 3, name: 'Todos', slug: 'health' },
  ];

  user_section = [
    { id: 1, name: 'Mi perfil', slug: 'profile' },
    { id: 2, name: 'Notificaciones', slug: 'profile' },
  ];

  page_resources = [
    { id: 3, name: 'Details', slug: 'resources' },
    { id: 1, name: 'Help', slug: 'resources' },
    { id: 2, name: 'Blog', slug: 'resources' },
  ];

  admin_section = [
    { id: 1, name: 'Usuarios', slug: 'admin' },
    { id: 2, name: 'Reportes', slug: 'admin' },
    { id: 3, name: 'Actividades', slug: 'admin' },
    { id: 4, name: 'Comunidades', slug: 'admin' },
  ];
}
