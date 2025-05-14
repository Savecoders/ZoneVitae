import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ColorVariant,
  SizeVariant,
  ValidationConfig,
} from '../../../../models/ui.model';
import { RadioComponent } from '../radio/radio.component';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  templateUrl: `./radio-group.component.html`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class RadioGroupComponent
  implements ControlValueAccessor, AfterContentInit
{
  @Input() name: string =
    'radio-group-' + Math.random().toString(36).substring(2, 10);
  @Input() label: string = '';
  @Input() labelId: string =
    'radio-group-label-' + Math.random().toString(36).substring(2, 10);
  @Input() color: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Input() inline: boolean = false;
  @Input() disabled: boolean = false;
  @Input() value: any;
  @Input() className: string = '';
  @Input() validation: ValidationConfig = { state: 'undefined', message: '' };

  @Output() valueChange = new EventEmitter<any>();

  @ContentChildren(RadioComponent) radioButtons!: QueryList<RadioComponent>;

  // ControlValueAccessor methods
  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  ngAfterContentInit() {
    if (this.radioButtons) {
      // Set initial values
      this.updateRadioButtons();

      // Subscribe to radio button changes
      this.radioButtons.forEach((radio) => {
        radio.valueChange.subscribe((value) => {
          this.value = value;
          this.onChangeCallback(value);
          this.valueChange.emit(value);
          this.updateRadioButtons();
        });
      });

      // Update radios when the collection changes (e.g., *ngFor)
      this.radioButtons.changes.subscribe(() => {
        this.updateRadioButtons();
      });
    }
  }

  private updateRadioButtons() {
    if (this.radioButtons) {
      this.radioButtons.forEach((radio) => {
        // Pass down properties to radio buttons
        radio.name = this.name;
        radio.disabled = this.disabled || radio.disabled;
        radio.size = radio.size || this.size;
        radio.color = radio.color || this.color;

        // Check the radio button if its value matches the group value
        radio.checked = radio.value === this.value;
      });
    }
  }

  // ControlValueAccessor interface implementation
  writeValue(value: any): void {
    this.value = value;
    this.updateRadioButtons();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.updateRadioButtons();
  }

  onTouched(): void {
    this.onTouchedCallback();
  }
}
