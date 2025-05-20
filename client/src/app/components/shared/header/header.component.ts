import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../primitives/input/input.component';
import { AvatarComponent } from '../primitives/avatar/avatar.component';
import { ThemeToggleComponent } from '../primitives/theme-toggle/theme-toggle.component';
import { AuthResponse } from 'app/models';
import { DropdownMenuComponent } from '../primitives';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputComponent,
    AvatarComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  user: any = null; // Changed from AuthResponse to any to handle different data structures
  private isBrowser: boolean;
  showUserMenu = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // user data in local storage

  ngOnInit(): void {
    if (!this.isBrowser) {
      console.warn(
        'This code is running on the server side, user data will not be available.'
      );
      return;
    }
    const userData = localStorage.getItem('user_data');
    console.log(userData);
    if (!userData) {
      console.warn('No user data found in local storage.');
      return;
    }
    try {
      const parsedData = JSON.parse(userData);
      // Process the user data to ensure we have a consistent structure
      this.user = {
        ...parsedData,
        // Ensure user field is available for template
        user: parsedData.user || parsedData,
      };
      console.log('User data loaded from local storage:', this.user);
    } catch (error) {
      console.log('Error parsing user data from local storage:', error);
      console.error('Error parsing user data from local storage:', error);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 10;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.showUserMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close the user menu when clicking outside of it
    const clickedElement = event.target as HTMLElement;
    const avatarClicked = clickedElement.closest('app-avatar');
    const menuClicked = clickedElement.closest('.absolute');

    if (!avatarClicked && !menuClicked && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }
}
