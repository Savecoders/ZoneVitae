import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { LayoutComponent } from "../../shared/layout/layout.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AvatarComponent } from "../../shared/primitives/avatar/avatar.component";
import { UsuarioService } from "../../../services/usuario.service";
import { ComunidadService } from "../../../services/comunidad.service";
import { ReporteService } from "../../../services/reporte.service";
import { BadgeComponent } from "../../shared/primitives/badge/badge.component";
import { UIModule } from "../../shared/ui.module";
import {
  Usuario,
  UsuarioGenero,
  Comunidad,
  Reporte,
  Actividad,
} from "app/models";
import {
  LucideAngularModule,
  UserIcon,
  CalendarIcon,
  ActivityIcon,
  UsersRoundIcon,
  ClipboardIcon,
  InboxIcon,
} from "lucide-angular";
import { catchError, forkJoin, map, of, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import {
  PostCardComponent,
  PostData,
} from "../../shared/post-card/post-card.component";
import {
  CommunityPostsComponent,
  CommunityPost,
} from "../../shared/community-posts/community-posts.component";

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [
    LayoutComponent,
    CommonModule,
    RouterModule,
    AvatarComponent,
    BadgeComponent,
    LucideAngularModule,
    UIModule,
    PostCardComponent,
    CommunityPostsComponent,
  ],
  templateUrl: "./user-profile.component.html",
  styleUrl: "./user-profile.component.css",
})
export class UserProfileComponent implements OnInit {
  userProfile: Usuario | null = null;
  loading = false;
  error = "";
  username: string = "";

  // Stats for the user
  stats = {
    activities: 0,
    communities: 0,
    reports: 0,
  }; // User's content
  activities: Actividad[] = [];
  communities: Comunidad[] = [];
  reports: Reporte[] = [];

  // Formatted data for components
  userPosts: PostData[] = [];
  communityPosts: CommunityPost[] = [];

  // Icons
  userIcon = UserIcon;
  calendarIcon = CalendarIcon;
  activityIcon = ActivityIcon;
  usersIcon = UsersRoundIcon;
  clipboardIcon = ClipboardIcon;
  inboxIcon = InboxIcon;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private comunidadService: ComunidadService,
    private reporteService: ReporteService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params["username"];
      if (this.username) {
        this.loadUserProfile();
      } else {
        this.router.navigate(["/not-found"]);
      }
    });
  }
  loadUserProfile(): void {
    this.loading = true;
    this.error = "";

    // Find user by exact username match using the updated service
    this.usuarioService
      .getUserByUsername(this.username)
      .pipe(
        switchMap((user) => {
          if (!user) {
            this.loading = false;
            this.router.navigate(["/not-found"]);
            return of(null);
          }

          this.userProfile = {
            ...user,
            genero: user.genero as UsuarioGenero,
          };

          // Get user's activities, communities, and reports in parallel
          return forkJoin({
            activities: this.http
              .get<
                Actividad[]
              >(`${environment.jsonServerUrl}/actividades?creador_id=${user.id}`)
              .pipe(
                catchError((err) => {
                  console.error("Error loading activities:", err);
                  return of([]);
                }),
              ),
            communities: this.http
              .get<
                { comunidad_id: number }[]
              >(`${environment.jsonServerUrl}/usuarios_comunidades_roles?usuario_id=${user.id}`)
              .pipe(
                switchMap((userCommunities) => {
                  if (userCommunities.length === 0) {
                    return of([]);
                  }

                  const communityIds = userCommunities.map(
                    (uc) => uc.comunidad_id,
                  );
                  return forkJoin(
                    communityIds.map((id) =>
                      this.comunidadService
                        .getById(id)
                        .pipe(catchError(() => of(null))),
                    ),
                  ).pipe(
                    map((communities) => communities.filter((c) => c !== null)),
                  );
                }),
                catchError((err) => {
                  console.error("Error loading communities:", err);
                  return of([]);
                }),
              ),
            reports: this.reporteService
              .getReportesByAutor(Number(user.id))
              .pipe(
                catchError((err) => {
                  console.error("Error loading reports:", err);
                  return of([]);
                }),
              ),
          });
        }),
        catchError((err) => {
          console.error("Error loading user profile:", err);
          this.error = err.message || "Error al cargar el perfil de usuario";
          this.loading = false;
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.activities = result.activities || [];
          this.communities = result.communities || [];
          this.reports = result.reports || [];

          // Format reports as PostData for post-card component
          this.userPosts = this.reports.map((report) => ({
            id: report.id as number,
            title: report.titulo,
            content: report.contenido,
            imageUrl:
              report.id && report.estado
                ? `https://source.unsplash.com/random/800x500?report,${
                    report.estado?.toLowerCase() || "general"
                  }`
                : `https://source.unsplash.com/random/800x500?report,general`,
            author: {
              id: Number(this.userProfile?.id) || 0,
              name: this.userProfile?.nombreUsuario || "Anónimo",
              avatarUrl: this.userProfile?.fotoPerfil || undefined,
            },
            community: report.comunidad_id
              ? {
                  id: report.comunidad_id as number,
                  name: "Comunidad", // We would need to fetch the community name
                  slug: "community",
                }
              : undefined,
            likes: 0, // You might want to fetch this data
            comments: 0, // You might want to fetch this data
            createdAt: report.create_at
              ? new Date(report.create_at)
              : new Date(),
          }));

          // Format communities for community-posts component
          this.communityPosts = this.communities.map((community) => ({
            id: Number(community.id),
            title: community.nombre,
            community: {
              id: Number(community.id),
              name: community.nombre,
              slug:
                community.nombre?.toLowerCase().replace(/\s+/g, "-") ||
                "community",
            },
            imageUrl: `https://source.unsplash.com/random/800x500?community,${
              community.nombre?.toLowerCase() || "general"
            }`,
          }));

          // Update stats
          this.stats = {
            activities: this.activities.length,
            communities: this.communities.length,
            reports: this.reports.length,
          };
        }

        this.loading = false;
      });
  }
}
