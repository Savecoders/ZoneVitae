import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../primitives/card/card.component';
import { AvatarComponent } from '../primitives/avatar/avatar.component';

export interface PostData {
  id: number;
  ID?: number; // Added for compatibility with the tracking function
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  community?: {
    id: number;
    name: string;
    slug: string;
  };
  likes: number;
  comments: number;
  createdAt: Date;
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, AvatarComponent],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PostCardComponent {
  @Input() post!: PostData;
}
