import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../primitives/card/card.component';
import { ButtonComponent } from '../primitives/button/button.component';
import { AvatarComponent } from '../primitives/avatar/avatar.component';
import { UsuarioService } from '../../../services/usuario.service';
import { ComunidadService } from '../../../services/comunidad.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface SuggestedCommunity {
  id: number;
  name: string;
  followers: number;
}

@Component({
  selector: 'app-follow-section',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, AvatarComponent],
  template: `
    <app-card class="p-4">
      <h2 class="text-xl font-medium mb-4">Follow</h2>
      <div class="flex flex-col gap-4">
        @for (community of suggestedCommunities; track community.id) {
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <app-avatar
              [name]="community.name"
              [size]="'sm'"
              [showBadge]="false"
            >
            </app-avatar>
            <div>
              <p class="font-medium text-sm">{{ community.name }}</p>
              <p class="text-xs text-foreground-muted">
                {{ community.followers }} followers
              </p>
            </div>
          </div>
          <app-button
            size="sm"
            color="primary"
            intensity="soft"
            (buttonClick)="followCommunity(community.id)"
            >Follow</app-button
          >
        </div>
        }
        <a href="/discover" class="text-primary text-sm hover:underline mt-2"
          >Discover more</a
        >
      </div>
    </app-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class FollowSectionComponent implements OnInit {
  suggestedCommunities: SuggestedCommunity[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private comunidadService: ComunidadService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSuggestedCommunities();
  }

  loadSuggestedCommunities(): void {
    this.comunidadService
      .getAll()
      .pipe(
        map((communities) => {
          // Get the first 3 communities
          return communities.slice(0, 3);
        }),
        map((communities) => {
          // For each community, count followers
          return communities.map((community) => {
            // In a real app, we would fetch actual followers, but for the demo we'll use a random number
            const followersCount = Math.floor(Math.random() * 500) + 50;

            return {
              id: community.ID as number,
              name: community.nombre,
              followers: followersCount,
            };
          });
        }),
        catchError((error) => {
          console.error('Error loading suggested communities:', error);
          return of([
            { id: 1, name: 'Community One', followers: 245 },
            { id: 2, name: 'Community Two', followers: 189 },
            { id: 3, name: 'Community Three', followers: 327 },
          ]);
        })
      )
      .subscribe((communities) => {
        this.suggestedCommunities = communities;
      });
  }

  followCommunity(communityId: number): void {
    console.log(`Following community with ID: ${communityId}`);
    // In a real app, you would actually create a follow relationship
    // For now, we'll just log it

    // Example of what you would do with real data:
    // const currentUserId = 1; // This would come from your auth service
    // const followData = { usuario_id: currentUserId, comunidad_id: communityId };
    // this.http.post(`${environment.jsonServerUrl}/follows`, followData)
    //   .subscribe({
    //     next: () => console.log('Successfully followed community'),
    //     error: (err) => console.error('Error following community', err)
    //   });
  }

  followUser(userId: number): void {
    console.log(`Following user with ID: ${userId}`);
    // Implement actual follow logic here
  }
}
