import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-option',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="option"
      [attr.aria-selected]="selected"
      class="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded"
      [class.bg-primary-100]="selected"
      [class.hover:bg-muted]="!selected"
      [class.text-primary-900]="selected"
    >
      <!-- Check icon for selected item -->
      @if (selected) {
      <span class="mr-2 text-primary flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </span>
      }

      <!-- Option content -->
      <span class="truncate">{{ label }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SelectOptionComponent {
  @Input() value: any;
  @Input() label = '';
  @Input() selected = false;
  @Input() disabled = false;

  @Output() select = new EventEmitter<any>();

  @HostListener('click')
  onClick(): void {
    if (!this.disabled) {
      this.select.emit(this.value);
    }
  }
}
