import {
  Component,
  HostListener,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { InputComponent } from "../primitives/input/input.component";
import { AvatarComponent } from "../primitives/avatar/avatar.component";
import { ThemeToggleComponent } from "../primitives/theme-toggle/theme-toggle.component";
import { AuthResponse } from "app/models";
import { DropdownMenuComponent } from "../primitives";
import { AuthService } from "../../../services/auth.service";
import {
  LucideAngularModule,
  UserIcon,
  UsersIcon,
  SearchIcon,
} from "lucide-angular";
import { Subscription } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputComponent,
    AvatarComponent,
    ThemeToggleComponent,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  user: AuthResponse | null = null;
  private isBrowser: boolean;
  userIcon = UserIcon;
  searchIcon = SearchIcon;
  showUserMenu = false;
  searchControl = new FormControl("");
  private authSubscription: Subscription | null = null;
  private searchSubscription: Subscription | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.currentUser$.subscribe({
      next: (userData: AuthResponse | null) => {
        this.user = userData;
      },
      error: (error) => {
        console.error("Error loading user data:", error);
        this.user = null;
      },
    });

    // Subscribe to search input changes
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.onSearch(searchTerm || "");
      });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 10;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToProfile(): void {
    this.router.navigate(["/profile"]);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.router.navigate(["/auth/login"]);
    this.showUserMenu = false;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    // Close the user menu when clicking outside of it
    const clickedElement = event.target as HTMLElement;
    const avatarClicked = clickedElement.closest("app-avatar");
    const menuClicked = clickedElement.closest(".absolute");

    if (!avatarClicked && !menuClicked && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      // Navigate to search results page
      this.router.navigate(["/search"], {
        queryParams: { q: searchTerm.trim() },
      });
    }
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const searchTerm = this.searchControl.value;
    if (searchTerm?.trim()) {
      this.onSearch(searchTerm.trim());
    }
  }
}
