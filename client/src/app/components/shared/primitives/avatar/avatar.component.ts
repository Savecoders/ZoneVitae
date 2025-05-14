import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeVariant } from '../../../../models/ui.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./avatar.component.html`,
  styleUrls: [`./avatar.component.css`],
})
export class AvatarComponent {
  @Input() src: string | null = null;
  @Input() alt: string = 'Avatar';
  @Input() name: string | null = null;
  @Input() size: SizeVariant = 'md';
  @Input() radius: 'sm' | 'md' | 'lg' | 'full' = 'full';
  @Input() bordered: boolean = false;
  @Input() showBadge: boolean = false;
  @Input() className: string = '';

  showFallback: boolean = false;

  get sizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    return sizes[this.size];
  }

  get radiusClasses(): string {
    const radiusMap: Record<'sm' | 'md' | 'lg' | 'full', string> = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return radiusMap[this.radius];
  }

  get initials(): string {
    if (!this.name) return '';

    const nameParts = this.name.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }

  onImageError(): void {
    this.showFallback = true;
  }
}
