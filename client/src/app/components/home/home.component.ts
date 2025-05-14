import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {
  PostCardComponent,
  PostData,
} from '../shared/post-card/post-card.component';
import { CommunityPostsComponent } from '../shared/community-posts/community-posts.component';
import { FollowSectionComponent } from '../shared/follow-section/follow-section.component';
import { ReporteService } from '../../services/reporte.service';
import { ComunidadService } from '../../services/comunidad.service';
import { UsuarioService } from '../../services/usuario.service';
import { ComentarioService } from '../../services/comentario.service';
import { TagService } from '../../services/tag.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comunidad } from '../../models/comunidad.model';
import { Tag } from '../../models/tag.model';
import { Actividad } from '../../models/actividad.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PostCardComponent,
    FollowSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // Reports/Posts data
  posts: PostData[] = [];
  isLoading = true;
  loadError = false;

  // Communities data
  communities: Comunidad[] = [];
  isLoadingCommunities = true;
  communityError = false;

  // Activities data
  activities: Actividad[] = [];
  isLoadingActivities = true;
  activitiesError = false;

  // Tags data
  tags: Tag[] = [];
  isLoadingTags = true;
  tagsError = false;

  // Users count
  userCount = 0;
  isLoadingUserCount = true;

  selectedTag: number | null = null;

  constructor(
    private reporteService: ReporteService,
    private comunidadService: ComunidadService,
    private usuarioService: UsuarioService,
    private comentarioService: ComentarioService,
    private tagService: TagService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadCommunities();
    this.loadActivities();
    this.loadTags();
    this.loadUserCount();
  }

  loadReports(): void {
    this.isLoading = true;
    this.loadError = false;

    this.reporteService
      .getAll()
      .pipe(
        switchMap((reports) => {
          if (reports.length === 0) {
            return of([]);
          }

          // Get unique community and author IDs from reports
          const communityIds = [
            ...new Set(
              reports
                .map((report) => report.comunidad_id)
                .filter((id) => id !== null)
            ),
          ];
          const authorIds = [
            ...new Set(
              reports
                .map((report) => report.autor_id)
                .filter((id) => id !== null)
            ),
          ];

          // Fetch communities and users in parallel
          return forkJoin({
            communities:
              communityIds.length > 0
                ? forkJoin(
                    communityIds.map((id) =>
                      this.comunidadService.getById(id as number)
                    )
                  )
                : of([]),
            authors:
              authorIds.length > 0
                ? forkJoin(
                    authorIds.map((id) =>
                      this.usuarioService.getById(id as number)
                    )
                  )
                : of([]),
            likes: this.http.get<any[]>(
              `${environment.jsonServerUrl}/me_encanta`
            ),
            reportComments: this.comentarioService.getAll(),
          }).pipe(
            map(({ communities, authors, likes, reportComments }) => {
              // Create a map for quick lookups
              const communityMap = new Map(communities.map((c) => [c.ID, c]));
              const authorMap = new Map(authors.map((a) => [a.ID, a]));

              // Transform reports into PostData format
              return reports.map((report) => {
                const community = report.comunidad_id
                  ? communityMap.get(report.comunidad_id)
                  : null;
                const author = report.autor_id
                  ? authorMap.get(report.autor_id)
                  : null;
                const postLikes = likes.filter(
                  (like: any) => like.reports_id === report.ID
                ).length;
                const postComments = reportComments.filter(
                  (comment) =>
                    // This is a simplification since comments in your data are linked to activities, not reports
                    // You'll need to adjust this based on your actual data structure
                    comment.actividades_Id === report.ID
                ).length;

                return {
                  id: report.ID as number,
                  ID: report.ID as number, // Adding this to ensure compatibility with track ID
                  title: report.titulo,
                  content: report.contenido,
                  // You would need to add a field for images in your model or get them from the fotos table
                  imageUrl: report.ID
                    ? `https://source.unsplash.com/random/800x500?report,${report.estado.toLowerCase()}`
                    : undefined,
                  author: {
                    id: (author?.ID as number) || 0,
                    name: author?.nombre_usuario || 'Anonymous',
                    avatarUrl: author?.foto_perfil || undefined,
                  },
                  community: community
                    ? {
                        id: community.ID as number,
                        name: community.nombre,
                        slug: community.nombre
                          .toLowerCase()
                          .replace(/\s+/g, '-'),
                      }
                    : undefined,
                  likes: postLikes,
                  comments: postComments,
                  createdAt: report.create_at
                    ? new Date(report.create_at)
                    : new Date(),
                };
              });
            })
          );
        }),
        catchError((error) => {
          console.error('Error loading reports:', error);
          this.loadError = true;
          return of([]);
        })
      )
      .subscribe((postsData) => {
        this.posts = postsData;
        this.isLoading = false;
      });
  }

  loadCommunities(): void {
    this.isLoadingCommunities = true;
    this.communityError = false;

    this.comunidadService
      .getAll()
      .pipe(
        catchError((error) => {
          console.error('Error loading communities:', error);
          this.communityError = true;
          return of([]);
        })
      )
      .subscribe((communities) => {
        this.communities = communities;
        this.isLoadingCommunities = false;
      });
  }

  loadActivities(): void {
    this.isLoadingActivities = true;
    this.activitiesError = false;

    this.http
      .get<Actividad[]>(`${environment.jsonServerUrl}/actividades`)
      .pipe(
        catchError((error) => {
          console.error('Error loading activities:', error);
          this.activitiesError = true;
          return of([]);
        })
      )
      .subscribe((activities) => {
        this.activities = activities;
        this.isLoadingActivities = false;
      });
  }

  loadTags(): void {
    this.isLoadingTags = true;
    this.tagsError = false;

    this.tagService
      .getAll()
      .pipe(
        catchError((error) => {
          console.error('Error loading tags:', error);
          this.tagsError = true;
          return of([]);
        })
      )
      .subscribe((tags) => {
        this.tags = tags;
        this.isLoadingTags = false;
      });
  }

  loadUserCount(): void {
    this.isLoadingUserCount = true;

    this.usuarioService
      .getAll()
      .pipe(
        map((users) => users.length),
        catchError((error) => {
          console.error('Error loading user count:', error);
          return of(0);
        })
      )
      .subscribe((count) => {
        this.userCount = count;
        this.isLoadingUserCount = false;
      });
  }

  filterByTag(tagId: number | null): void {
    this.selectedTag = tagId;
    this.isLoading = true;

    if (tagId === null) {
      // If no tag is selected, just load all reports
      this.loadReports();
      return;
    }

    // Get reports with this tag
    this.http
      .get<any[]>(`${environment.jsonServerUrl}/reports_tags?id=${tagId}`)
      .pipe(
        switchMap((relations) => {
          if (relations.length === 0) {
            return of([]);
          }

          const reportIds = relations.map((rel) => rel.reports_id);
          return forkJoin(
            reportIds.map((id) => this.reporteService.getById(id))
          );
        }),
        switchMap((reports) => {
          if (reports.length === 0) {
            return of([]);
          }

          // Get unique community and author IDs from reports
          const communityIds = [
            ...new Set(
              reports
                .map((report) => report.comunidad_id)
                .filter((id) => id !== null)
            ),
          ];
          const authorIds = [
            ...new Set(
              reports
                .map((report) => report.autor_id)
                .filter((id) => id !== null)
            ),
          ];

          // Use the same transformation logic as in loadReports
          return forkJoin({
            communities:
              communityIds.length > 0
                ? forkJoin(
                    communityIds.map((id) =>
                      this.comunidadService.getById(id as number)
                    )
                  )
                : of([]),
            authors:
              authorIds.length > 0
                ? forkJoin(
                    authorIds.map((id) =>
                      this.usuarioService.getById(id as number)
                    )
                  )
                : of([]),
            likes: this.http.get<any[]>(
              `${environment.jsonServerUrl}/me_encanta`
            ),
            reportComments: this.comentarioService.getAll(),
          }).pipe(
            map(({ communities, authors, likes, reportComments }) => {
              // Create a map for quick lookups
              const communityMap = new Map(communities.map((c) => [c.ID, c]));
              const authorMap = new Map(authors.map((a) => [a.ID, a]));

              // Transform reports into PostData format
              return reports.map((report) => {
                const community = report.comunidad_id
                  ? communityMap.get(report.comunidad_id)
                  : null;
                const author = report.autor_id
                  ? authorMap.get(report.autor_id)
                  : null;
                const postLikes = likes.filter(
                  (like: any) => like.reports_id === report.ID
                ).length;
                const postComments = reportComments.filter(
                  (comment) => comment.actividades_Id === report.ID
                ).length;

                return {
                  id: report.ID as number,
                  ID: report.ID as number, // Adding this to ensure compatibility with track ID
                  title: report.titulo,
                  content: report.contenido,
                  imageUrl: report.ID
                    ? `https://source.unsplash.com/random/800x500?report,${report.estado.toLowerCase()}`
                    : undefined,
                  author: {
                    id: (author?.ID as number) || 0,
                    name: author?.nombre_usuario || 'Anonymous',
                    avatarUrl: author?.foto_perfil || undefined,
                  },
                  community: community
                    ? {
                        id: community.ID as number,
                        name: community.nombre,
                        slug: community.nombre
                          .toLowerCase()
                          .replace(/\s+/g, '-'),
                      }
                    : undefined,
                  likes: postLikes,
                  comments: postComments,
                  createdAt: report.create_at
                    ? new Date(report.create_at)
                    : new Date(),
                };
              });
            })
          );
        }),
        catchError((error) => {
          console.error('Error filtering by tag:', error);
          this.loadError = true;
          return of([]);
        })
      )
      .subscribe((postsData) => {
        this.posts = postsData;
        this.isLoading = false;
      });
  }
}
