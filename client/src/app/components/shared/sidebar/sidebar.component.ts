import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../primitives/card/card.component';
import { SeparatorComponent } from '../primitives/separator/separator.component';
import {
  LucideAngularModule,
  HomeIcon,
  TelescopeIcon,
  MapPinIcon,
  ProportionsIcon,
  MegaphoneIcon,
  VolleyballIcon,
  UserRoundIcon,
  BellIcon,
  NotepadTextIcon,
  CircleHelpIcon,
  BetweenVerticalEnd,
  UsersRoundIcon,
  LayoutPanelLeftIcon,
  LayoutGridIcon,
} from 'lucide-angular';
import { ILinks } from '../../../lib/ILinks.interface';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    SeparatorComponent,
    LucideAngularModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isCollapsed = false;
  ChevronLeftIcon = LayoutPanelLeftIcon;
  ChevronRightIcon = LayoutGridIcon;

  topics: ILinks[] = [
    { id: 1, name: 'Home', slug: '', icon: HomeIcon },
    { id: 2, name: 'Explorar', slug: 'reports', icon: TelescopeIcon },
    { id: 3, name: 'Comunidades', slug: 'comunities', icon: MapPinIcon },
    { id: 4, name: 'Reportes', slug: 'reports', icon: ProportionsIcon },
    { id: 5, name: 'Actividades', slug: 'activities', icon: MegaphoneIcon },
    { id: 6, name: 'Todos', slug: 'reports', icon: VolleyballIcon },
  ];

  user_section: ILinks[] = [
    { id: 7, name: 'Mi perfil', slug: 'profile', icon: UserRoundIcon },
    { id: 8, name: 'Notificaciones', slug: 'profile', icon: BellIcon },
  ];

  page_resources: ILinks[] = [
    { id: 9, name: 'Details', slug: 'about', icon: NotepadTextIcon },
    { id: 10, name: 'Help', slug: 'helps', icon: CircleHelpIcon },
    { id: 11, name: 'Blog', slug: 'about', icon: BetweenVerticalEnd },
  ];

  admin_section: ILinks[] = [
    { id: 12, name: 'Usuarios', slug: 'admin', icon: UsersRoundIcon },
    { id: 13, name: 'Reportes', slug: 'admin', icon: ProportionsIcon },
    { id: 14, name: 'Actividades', slug: 'admin', icon: MegaphoneIcon },
    { id: 15, name: 'Comunidades', slug: 'admin', icon: MapPinIcon },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
