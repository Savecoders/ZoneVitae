import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  HostListener,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  ColorVariant,
  SizeVariant,
  RadiusVariant,
  ValidationConfig,
} from '../../../../models/ui.model';
import { SelectOptionComponent } from './select-option.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative w-full"
      [class.cursor-not-allowed]="disabled"
      [class.opacity-50]="disabled"
    >
      <!-- Label for the select -->
      @if (label) {
      <label
        [for]="id"
        class="block text-sm font-medium mb-2"
        [class.text-danger]="validation?.state === 'invalid'"
      >
        {{ label }}
        @if (required) {
        <span class="text-danger ml-1">*</span>
        }
      </label>
      }

      <!-- Select trigger button -->
      <button
        #triggerButton
        type="button"
        [id]="id"
        [disabled]="disabled"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="id + '-listbox'"
        class="flex items-center justify-between w-full border bg-background shadow-sm"
        [ngClass]="[
          radiusClasses,
          sizeClasses,
          validation?.state === 'invalid'
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-input focus:border-primary focus:ring-primary/20'
        ]"
      >
        <span class="truncate" [class.text-foreground-muted]="!selectedLabel">
          {{ selectedLabel || placeholder }}
        </span>
        <span class="pointer-events-none flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-200"
            [class.rotate-180]="isOpen"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <!-- Dropdown options -->
      @if (isOpen) {
      <div
        [id]="id + '-listbox'"
        role="listbox"
        class="absolute left-0 z-10 mt-1 max-h-60 w-full overflow-auto border border-input rounded-md bg-background shadow-md p-1"
        [ngClass]="radiusClasses"
      >
        <ng-content></ng-content>
      </div>
      }

      <!-- Validation message -->
      @if (validation?.message && validation?.state === 'invalid') {
      <div class="text-danger text-sm mt-1">
        {{ validation?.message }}
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit {
  @Input() id = `select-${Math.floor(Math.random() * 1000000)}`;
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() disabled = false;
  @Input() required = false;
  @Input() color: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Input() radius: RadiusVariant = 'md';
  @Input() validation?: ValidationConfig;
  @Input() fullWidth = true;

  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild('triggerButton') triggerButton!: ElementRef;
  @ContentChildren(SelectOptionComponent)
  options!: QueryList<SelectOptionComponent>;

  isOpen = false;
  selectedValue: any = null;
  selectedLabel = '';

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit(): void {
    // Subscribe to option changes
    this.options.changes.subscribe(() => this.updateSelectedLabel());
    // Initial setup
    this.updateSelectedLabel();

    // Setup option selection handling
    this.options.forEach((option) => {
      option.select.subscribe((value) => {
        this.writeValue(value);
        this.onChange(value);
        this.onTouched();
        this.selectionChange.emit(value);
        this.isOpen = false;
      });
    });
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.onTouched();
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.updateSelectedLabel();

    // Update the selected state of options
    if (this.options) {
      this.options.forEach((option) => {
        option.selected = option.value === value;
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private updateSelectedLabel(): void {
    if (!this.options) return;

    const selectedOption = this.options.find(
      (option) => option.value === this.selectedValue
    );
    this.selectedLabel = selectedOption ? selectedOption.label : '';
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
