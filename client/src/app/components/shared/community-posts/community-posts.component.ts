import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../primitives/card/card.component';
import { ComunidadService } from '../../../services/comunidad.service';
import { ReporteService } from '../../../services/reporte.service';
import { catchError, forkJoin, map, of } from 'rxjs';

export interface CommunityPost {
  id: number;
  title: string;
  community: {
    id: number;
    name: string;
    slug: string;
  };
  imageUrl?: string;
}

@Component({
  selector: 'app-community-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './community-posts.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CommunityPostsComponent implements OnInit {
  @Input() communityPosts: CommunityPost[] = [];
  isLoading = true;

  constructor(
    private comunidadService: ComunidadService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    if (this.communityPosts.length === 0) {
      this.loadCommunityPosts();
    } else {
      this.isLoading = false;
    }
  }

  loadCommunityPosts(): void {
    this.isLoading = true;

    // Get communities and one report per community
    this.comunidadService
      .getAll()
      .pipe(
        map((communities) => {
          // Take only first 5 communities
          return communities.slice(0, 5);
        }),
        map((communities) => {
          return communities.map((community) => {
            return {
              id: community.id as number,
              title: community.nombre,
              community: {
                id: community.id as number,
                name: community.nombre,
                slug: community.nombre.toLowerCase().replace(/\s+/g, '-'),
              },
              // Without real images, we'll use placeholders
              imageUrl: `https://source.unsplash.com/500x300/?${community.nombre
                .toLowerCase()
                .replace(/\s+/g, '+')}`,
            };
          });
        }),
        catchError((error) => {
          console.error('Error loading community posts:', error);
          return of([]);
        })
      )
      .subscribe((posts) => {
        this.communityPosts = posts;
        this.isLoading = false;
      });
  }
}
