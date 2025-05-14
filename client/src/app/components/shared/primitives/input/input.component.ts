import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  ColorVariant,
  SizeVariant,
  RadiusVariant,
  ValidationConfig,
} from '../../../../models/ui.model';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: `./input.component.html`,
  styleUrls: [`./input.component.css`],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() startContent: any = null;
  @Input() endContent: any = null;
  @Input() className: string = '';
  @Input() size: SizeVariant = 'md';
  @Input() radius: RadiusVariant = 'md';
  @Input() color: ColorVariant = 'default';
  @Input() validation: ValidationConfig = { state: 'undefined', message: '' };

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

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

  get borderClasses(): string {
    if (this.validation?.state === 'invalid') {
      return 'border border-danger focus:ring-2 ring-danger-200';
    }

    const borderMap: Record<ColorVariant, string> = {
      default:
        'border border-default-300 focus:border-primary focus:ring-2 ring-primary-200',
      primary:
        'border border-primary-300 focus:border-primary focus:ring-2 ring-primary-200',
      secondary:
        'border border-secondary-300 focus:border-secondary focus:ring-2 ring-secondary-200',
      success:
        'border border-success-300 focus:border-success focus:ring-2 ring-success-200',
      warning:
        'border border-warning-300 focus:border-warning focus:ring-2 ring-warning-200',
      danger:
        'border border-danger-300 focus:border-danger focus:ring-2 ring-danger-200',
    };

    return borderMap[this.color];
  }

  get colorClasses(): string {
    return 'text-foreground';
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this._onChange(value);
    this.valueChange.emit(value);
  }

  onBlur(): void {
    this._onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }
}
