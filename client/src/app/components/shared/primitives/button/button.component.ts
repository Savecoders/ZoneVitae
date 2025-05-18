import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ColorVariant,
  IntensityVariant,
  RadiusVariant,
  SizeVariant,
} from '../../../../models/ui.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: `./button.component.html`,
  styles: [],
})
export class ButtonComponent {
  @Input() color: ColorVariant = 'default';
  @Input() icon: LucideIconData = PlusIcon;
  @Input() size: SizeVariant = 'md';
  @Input() radius: RadiusVariant = 'md';
  @Input() intensity: IntensityVariant = 'solid';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() className = '';

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  get hasSpinner(): boolean {
    return this.loading;
  }

  get colorClasses(): string {
    const baseColor = this.color;
    const classes: Record<IntensityVariant, Record<ColorVariant, string>> = {
      solid: {
        default: `bg-default text-default-foreground hover:bg-default-700 active:bg-default-800`,
        primary: `bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-700`,
        secondary: `bg-secondary text-secondary-foreground hover:bg-secondary-600 active:bg-secondary-700`,
        success: `bg-success text-success-foreground hover:bg-success-600 active:bg-success-700`,
        warning: `bg-warning text-warning-foreground hover:bg-warning-600 active:bg-warning-700`,
        danger: `bg-danger text-danger-foreground hover:bg-danger-600 active:bg-danger-700`,
      },
      soft: {
        default: `bg-default-100 text-default-900 hover:bg-default-200 active:bg-default-300`,
        primary: `bg-primary-100 text-primary-900 hover:bg-primary-200 active:bg-primary-300`,
        secondary: `bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300`,
        success: `bg-success-100 text-success-900 hover:bg-success-200 active:bg-success-300`,
        warning: `bg-warning-100 text-warning-900 hover:bg-warning-200 active:bg-warning-300`,
        danger: `bg-danger-100 text-danger-900 hover:bg-danger-200 active:bg-danger-300`,
      },
      outline: {
        default: `border border-default bg-transparent text-default hover:bg-default-100 active:bg-default-200`,
        primary: `border border-primary bg-transparent text-primary hover:bg-primary-100 active:bg-primary-200`,
        secondary: `border border-secondary bg-transparent text-secondary hover:bg-secondary-100 active:bg-secondary-200`,
        success: `border border-success bg-transparent text-success hover:bg-success-100 active:bg-success-200`,
        warning: `border border-warning bg-transparent text-warning hover:bg-warning-100 active:bg-warning-200`,
        danger: `border border-danger bg-transparent text-danger hover:bg-danger-100 active:bg-danger-200`,
      },
      ghost: {
        default: `bg-transparent text-default hover:bg-default-100 active:bg-default-200`,
        primary: `bg-transparent text-primary hover:bg-primary-100 active:bg-primary-200`,
        secondary: `bg-transparent text-secondary hover:bg-secondary-100 active:bg-secondary-200`,
        success: `bg-transparent text-success hover:bg-success-100 active:bg-success-200`,
        warning: `bg-transparent text-warning hover:bg-warning-100 active:bg-warning-200`,
        danger: `bg-transparent text-danger hover:bg-danger-100 active:bg-danger-200`,
      },
    };

    return classes[this.intensity][baseColor];
  }

  get sizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'text-xs py-1 px-2',
      sm: 'text-sm py-1.5 px-3',
      md: 'text-base py-2 px-4',
      lg: 'text-lg py-2.5 px-5',
      xl: 'text-xl py-3 px-6',
    };

    return sizes[this.size];
  }

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
}
