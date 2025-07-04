import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.isBrowser) {
      return true;
    }

    // Check if the user is logged in
    if (this.authService.isLoggedIn() && !this.authService.isTokenExpired()) {
      // If a specific role is required for the route
      const requiredRole = route.data["role"] as string;

      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        // Redirect to unauthorized page or home if user doesn't have the required role
        return this.router.createUrlTree(["/unauthorized"]);
      }

      // User is authenticated and has the required role (if any)
      return true;
    }

    // User is not logged in, redirect to login page with return URL
    return this.router.createUrlTree(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
  }
}
