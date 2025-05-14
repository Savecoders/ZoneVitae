import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorVariant, SizeVariant } from '../../../../models/ui.model';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `
    <label
      [ngClass]="[
        'inline-flex items-center gap-2 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className || ''
      ]"
    >
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only peer"
          [id]="id"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onChange($event)"
          (blur)="onTouched()"
        />
        <div
          [ngClass]="[
            'relative transition-colors duration-200 rounded-full peer',
            sizeClasses,
            checked ? bgColorClasses : 'bg-muted',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <div
            [ngClass]="[
              'absolute transform transition-transform duration-200 rounded-full bg-background',
              thumbSizeClasses,
              checked
                ? thumbPositionClasses.checked
                : thumbPositionClasses.unchecked
            ]"
          ></div>
        </div>
      </div>
      @if (label) {
      <span [ngClass]="textSizeClasses">{{ label }}</span>
      } @else {
      <ng-content></ng-content>
      }
    </label>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() id: string = 'toggle-' + Math.random().toString(36).substring(2, 10);
  @Input() color: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Input() label: string = '';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  // ControlValueAccessor methods
  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  get bgColorClasses(): string {
    const colors: Record<ColorVariant, string> = {
      default: 'bg-default',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
    };

    return colors[this.color];
  }

  get sizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-6 h-3',
      sm: 'w-8 h-4',
      md: 'w-10 h-5',
      lg: 'w-12 h-6',
      xl: 'w-14 h-7',
    };

    return sizes[this.size];
  }

  get thumbSizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-2 h-2',
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    return sizes[this.size];
  }

  get thumbPositionClasses(): { checked: string; unchecked: string } {
    const positions: Record<
      SizeVariant,
      { checked: string; unchecked: string }
    > = {
      xs: {
        checked: 'translate-x-3.5 top-0.5',
        unchecked: 'translate-x-0.5 top-0.5',
      },
      sm: {
        checked: 'translate-x-4.5 top-0.5',
        unchecked: 'translate-x-0.5 top-0.5',
      },
      md: {
        checked: 'translate-x-5.5 top-0.5',
        unchecked: 'translate-x-0.5 top-0.5',
      },
      lg: {
        checked: 'translate-x-6.5 top-0.5',
        unchecked: 'translate-x-0.5 top-0.5',
      },
      xl: {
        checked: 'translate-x-7.5 top-0.5',
        unchecked: 'translate-x-0.5 top-0.5',
      },
    };

    return positions[this.size];
  }

  get textSizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    return sizes[this.size];
  }

  onChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.checked = isChecked;

    this.onChangeCallback(isChecked);
    this.checkedChange.emit(isChecked);
  }

  // ControlValueAccessor interface implementation
  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTouched(): void {
    this.onTouchedCallback();
  }
}
