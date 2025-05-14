import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styles: [],
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  get currentTheme() {
    return this.themeService.currentTheme();
  }

  get effectiveTheme() {
    return this.themeService.getEffectiveTheme();
  }
}
