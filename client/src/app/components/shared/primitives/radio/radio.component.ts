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
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  templateUrl: `./radio.component.html`,
  styles: [
    `
      :host {
        color: var(--foreground);
        display: inline-flex;
      }

      .text-default div {
        background-color: var(--default);
      }

      .text-primary div {
        background-color: var(--primary);
      }

      .text-secondary div {
        background-color: var(--secondary);
      }

      .text-success div {
        background-color: var(--success);
      }

      .text-warning div {
        background-color: var(--warning);
      }

      .text-danger div {
        background-color: var(--danger);
      }
    `,
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input() id: string = 'radio-' + Math.random().toString(36).substring(2, 10);
  @Input() name: string = 'radio-group';
  @Input() value: any;
  @Input() color: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Input() label: string = '';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<any>();

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

  get dotSizeClasses(): string {
    const sizes: Record<SizeVariant, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
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
    const radio = event.target as HTMLInputElement;
    this.checked = radio.checked;

    if (this.checked) {
      this.onChangeCallback(this.value);
      this.checkedChange.emit(this.checked);
      this.valueChange.emit(this.value);
    }
  }

  // ControlValueAccessor interface implementation
  writeValue(value: any): void {
    this.checked = this.value === value;
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
