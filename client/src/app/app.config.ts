import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { DEFAULT_UI_CONFIG, UI_CONFIG } from './config/ui.config';
import { ThemeService } from './services/theme.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

// Import the CloudinaryModule Docs
import { CloudinaryModule } from '@cloudinary/ng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: UI_CONFIG, useValue: DEFAULT_UI_CONFIG },
    ThemeService,
    provideHttpClient(withFetch()),
    CloudinaryModule,
  ],
};
