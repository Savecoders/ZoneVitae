import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ColorVariant,
  IntensityVariant,
  SizeVariant,
} from '../../../../models/ui.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./badge.component.html`,
  styleUrls: [`./badge.component.css`],
})
export class BadgeComponent {
  @Input() color: ColorVariant = 'default';
  @Input() size: SizeVariant = 'md';
  @Input() intensity: IntensityVariant = 'solid';
  @Input() className = '';
  @Input() dot = false;

  get sizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'text-xs px-1',
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-0.5',
      lg: 'text-sm px-2.5 py-1',
      xl: 'text-base px-3 py-1',
    };

    return sizes[this.size];
  }

  get colorClasses(): string {
    const baseColor = this.color;
    const classes: Record<IntensityVariant, Record<ColorVariant, string>> = {
      solid: {
        default: `bg-default text-default-foreground rounded-full`,
        primary: `bg-primary text-primary-foreground rounded-full`,
        secondary: `bg-secondary text-secondary-foreground rounded-full`,
        success: `bg-success text-success-foreground rounded-full`,
        warning: `bg-warning text-warning-foreground rounded-full`,
        danger: `bg-danger text-danger-foreground rounded-full`,
      },
      soft: {
        default: `bg-default-100 text-default-900 rounded-full`,
        primary: `bg-primary-100 text-primary-900 rounded-full`,
        secondary: `bg-secondary-100 text-secondary-900 rounded-full`,
        success: `bg-success-100 text-success-900 rounded-full`,
        warning: `bg-warning-100 text-warning-900 rounded-full`,
        danger: `bg-danger-100 text-danger-900 rounded-full`,
      },
      outline: {
        default: `border border-default bg-transparent text-default rounded-full`,
        primary: `border border-primary bg-transparent text-primary rounded-full`,
        secondary: `border border-secondary bg-transparent text-secondary rounded-full`,
        success: `border border-success bg-transparent text-success rounded-full`,
        warning: `border border-warning bg-transparent text-warning rounded-full`,
        danger: `border border-danger bg-transparent text-danger rounded-full`,
      },
      ghost: {
        default: `bg-transparent text-default rounded-full`,
        primary: `bg-transparent text-primary rounded-full`,
        secondary: `bg-transparent text-secondary rounded-full`,
        success: `bg-transparent text-success rounded-full`,
        warning: `bg-transparent text-warning rounded-full`,
        danger: `bg-transparent text-danger rounded-full`,
      },
    };

    return classes[this.intensity][baseColor];
  }
}
