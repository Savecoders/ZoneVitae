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
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: `./checkbox.component.html`,
  styles: [
    `
      :host {
        color: var(--foreground);
        display: inline-flex;
      }
    `,
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() id: string =
    'checkbox-' + Math.random().toString(36).substring(2, 10);
  @Input() color: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Input() label: string = '';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() checked: boolean | null = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  // ControlValueAccessor methods
  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  get colorClasses(): string {
    const colors: Record<ColorVariant, string> = {
      default: 'text-default',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
    };

    return colors[this.color];
  }

  get sizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    return sizes[this.size];
  }

  get iconSizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-2 h-2 stroke-background',
      sm: 'w-3 h-3 stroke-background',
      md: 'w-3.5 h-3.5 stroke-background',
      lg: 'w-4 h-4 stroke-background',
      xl: 'w-5 h-5 stroke-background',
    };

    return sizes[this.size];
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
  writeValue(value: boolean | null): void {
    this.checked = value;
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
