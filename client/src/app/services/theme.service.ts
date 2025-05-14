import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private window = this.document.defaultView;
  private storage = this.window?.localStorage;

  private readonly THEME_KEY = 'zone-vitae-theme';
  private readonly DARK_CLASS = 'dark';
  private systemTheme = signal<'light' | 'dark'>('dark');

  currentTheme = signal<Theme>('system');

  constructor() {
    this.initialize();

    // Listen for system theme changes
    if (this.window?.matchMedia) {
      const mediaQuery = this.window.matchMedia('(prefers-color-scheme: dark)');

      // Set initial system theme
      this.systemTheme.set(mediaQuery.matches ? 'dark' : 'light');

      // Update when system theme changes
      mediaQuery.addEventListener('change', (e) => {
        this.systemTheme.set(e.matches ? 'dark' : 'light');
        if (this.currentTheme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  initialize(): void {
    const savedTheme = this.storage?.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);
    } else {
      this.applyTheme('system');
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.storage?.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark' || (theme === 'system' && this.systemTheme() === 'dark');

    if (isDark) {
      this.document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      this.document.documentElement.classList.remove(this.DARK_CLASS);
    }
  }

  getEffectiveTheme(): 'light' | 'dark' {
    const theme = this.currentTheme();
    return theme === 'system' ? this.systemTheme() : theme;
  }

  toggleTheme(): void {
    const current = this.currentTheme();
    if (current === 'dark') {
      this.setTheme('light');
    } else if (current === 'light') {
      this.setTheme('system');
    } else {
      this.setTheme('dark');
    }
  }
}
