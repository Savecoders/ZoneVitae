import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DEFAULT_UI_CONFIG, UI_CONFIG } from './config/ui.config';
import { ThemeService } from './services/theme.service';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

// Import the CloudinaryModule Docs
import { CloudinaryModule } from '@cloudinary/ng';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    { provide: UI_CONFIG, useValue: DEFAULT_UI_CONFIG },
    ThemeService,
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    CloudinaryModule,
  ],
};
