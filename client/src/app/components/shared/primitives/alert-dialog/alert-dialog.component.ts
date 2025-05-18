import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ColorVariant } from '../../../../models/ui.model';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
    <div
      class="fixed inset-0 bg-overlay/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      (click)="closeOnBackdropClick ? close() : null"
    >
      <div
        class="bg-content1 rounded-lg shadow-lg w-full max-w-md flex flex-col border border-content3"
        [class]="className"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-content2"
        >
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          @if (showCloseButton) {
          <button
            class="text-default-500 hover:text-danger focus:outline-none"
            (click)="close()"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          }
        </div>

        <!-- Content -->
        <div class="p-4">
          <p>{{ description }}</p>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 p-4 border-t border-content2">
          @if (showCancelButton) {
          <app-button
            [color]="cancelButtonColor"
            intensity="ghost"
            (buttonClick)="onCancel()"
          >
            {{ cancelButtonText }}
          </app-button>
          }
          <app-button [color]="confirmButtonColor" (buttonClick)="onConfirm()">
            {{ confirmButtonText }}
          </app-button>
        </div>
      </div>
    </div>
    }
  `,
})
export class AlertDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Alert';
  @Input() description = '';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';
  @Input() confirmButtonColor: ColorVariant = 'primary';
  @Input() cancelButtonColor: ColorVariant = 'default';
  @Input() showCancelButton = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() className = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.close();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }
}
