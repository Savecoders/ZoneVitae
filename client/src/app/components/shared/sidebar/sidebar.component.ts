import { Component, inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CardComponent } from "../primitives/card/card.component";
import { SeparatorComponent } from "../primitives/separator/separator.component";
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
} from "lucide-angular";
import { ILinks } from "../../../lib/ILinks.interface";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-sidebar",
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    SeparatorComponent,
    LucideAngularModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  isCollapsed = false;
  ChevronLeftIcon = LayoutPanelLeftIcon;
  ChevronRightIcon = LayoutGridIcon;
  authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  // Check local storage for previously saved state
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedState = localStorage.getItem("sidebarCollapsed");
      this.isCollapsed = savedState === "true";
    }
  }

  topics: ILinks[] = [
    { id: 1, name: "Home", slug: "home", icon: HomeIcon },
    { id: 2, name: "Explorar", slug: "reports", icon: TelescopeIcon },
    { id: 3, name: "Comunidades", slug: "comunities", icon: MapPinIcon },
    { id: 4, name: "Reportes", slug: "reports", icon: ProportionsIcon },
    { id: 5, name: "Actividades", slug: "activities", icon: MegaphoneIcon },
    { id: 6, name: "Todos", slug: "reports", icon: VolleyballIcon },
    { id: 18, name: "Auditoria", slug: "auditoria", icon: BetweenVerticalEnd },
  ];

  user_section: ILinks[] = [
    { id: 7, name: "Mi perfil", slug: "profile", icon: UserRoundIcon },
    { id: 8, name: "Notificaciones", slug: "profile", icon: BellIcon },
  ];

  page_resources: ILinks[] = [
    { id: 9, name: "Details", slug: "about", icon: NotepadTextIcon },
    { id: 10, name: "Help", slug: "helps", icon: CircleHelpIcon },
    { id: 11, name: "Blog", slug: "about", icon: BetweenVerticalEnd },
  ];

  admin_section: ILinks[] = [
    { id: 12, name: "Usuarios", slug: "admin", icon: UsersRoundIcon },
    { id: 13, name: "Reportes", slug: "admin", icon: ProportionsIcon },
    {
      id: 14,
      name: "Actividades",
      slug: "activities",
      icon: MegaphoneIcon,
    },
    { id: 15, name: "Comunidades", slug: "admin", icon: MapPinIcon },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;

    if (isPlatformBrowser(this.platformId)) {
      // Save state to localStorage only in browser environment
      localStorage.setItem("sidebarCollapsed", String(this.isCollapsed));

      if (this.isCollapsed) {
        document.body.classList.add("sidebar-collapsed");
      } else {
        document.body.classList.remove("sidebar-collapsed");
      }

      // Dispatch a custom event that the header can listen to
      const event = new CustomEvent("sidebarToggle", {
        detail: { collapsed: this.isCollapsed },
      });
      window.dispatchEvent(event);
    }
  }
}
