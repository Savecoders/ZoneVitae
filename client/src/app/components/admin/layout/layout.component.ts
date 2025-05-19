import { Component } from '@angular/core';
import { FooterComponent } from 'app/components/shared/footer/footer.component';
import { HeaderComponent } from 'app/components/shared/header/header.component';
import { SidebarComponent } from 'app/components/shared/sidebar/sidebar.component';

@Component({
  selector: 'admin-layout',
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class AdminLayoutComponent {}
