import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiusVariant, SizeVariant } from '../../../../models/ui.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./card.component.html`,
  styles: [],
})
export class CardComponent {
  @Input() radius: RadiusVariant = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() bordered = false;
  @Input() className = '';

  get radiusClasses(): string {
    const radiusMap: Record<RadiusVariant, string> = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return radiusMap[this.radius];
  }

  get shadowClasses(): string {
    const shadowMap = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg',
    };

    return shadowMap[this.shadow];
  }

  get borderClasses(): string {
    return this.bordered ? 'border border-default-200' : '';
  }
}
