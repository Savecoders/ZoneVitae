import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { ThemeTransitionDirective } from './directives/theme-transition.directive';
import { ToastProviderComponent } from './components/shared/primitives/toast/toast-provider.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeTransitionDirective, ToastProviderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ZoneVitae';
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Initialize the theme service to apply the saved theme preference
    this.themeService.initialize();
  }
}
