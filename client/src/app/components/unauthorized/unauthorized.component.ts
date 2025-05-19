import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  AlertTriangleIcon,
  HomeIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-default-50 p-4"
    >
      <div
        class="max-w-md w-full p-8 bg-default-100 rounded-xl shadow-lg text-center"
      >
        <div class="flex justify-center mb-6">
          <i-lucide
            [img]="alertIcon"
            class="w-16 h-16 text-danger-500"
          ></i-lucide>
        </div>
        <h1 class="text-3xl font-bold text-default-900 mb-4">
          Acceso Denegado
        </h1>
        <p class="text-default-700 mb-8">
          Lo sentimos, no tienes permiso para acceder a esta página. Si crees
          que esto es un error, por favor contacta al administrador.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <i-lucide [img]="homeIcon" class="w-5 h-5"></i-lucide>
            Volver al Inicio
          </a>
          <a
            routerLink="/auth/login"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-default-200 text-default-800 rounded-lg hover:bg-default-300 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class UnauthorizedComponent {
  alertIcon = AlertTriangleIcon;
  homeIcon = HomeIcon;
}
