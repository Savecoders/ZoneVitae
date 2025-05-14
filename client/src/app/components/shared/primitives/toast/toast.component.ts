import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../../services/toast.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
      [class.bg-background]="type === 'default'"
      [class.border-success]="type === 'success'"
      [class.bg-success-50]="type === 'success'"
      [class.border-danger]="type === 'error'"
      [class.bg-danger-50]="type === 'error'"
      [class.border-warning]="type === 'warning'"
      [class.bg-warning-50]="type === 'warning'"
      [class.border-default]="type === 'loading'"
      [class.bg-default-50]="type === 'loading'"
      [class]="className"
      role="status"
      aria-live="polite"
      data-state="open"
      data-swipe-direction="right"
    >
      <div class="grid gap-1">
        <div class="flex items-center gap-2">
          <!-- Icon based on toast type -->
          @if (type === 'success') {
          <span class="text-success">
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
          } @if (type === 'error') {
          <span class="text-danger">
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
              <path d="m18 6-12 12"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </span>
          } @if (type === 'warning') {
          <span class="text-warning">
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
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              ></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
          } @if (type === 'loading') {
          <span class="animate-spin text-default">
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
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </span>
          }

          <!-- Custom icon if provided -->
          @if (icon && type === 'default') {
          <span [innerHTML]="icon"></span>
          }

          <h3 class="text-sm font-medium">{{ message }}</h3>
        </div>

        <!-- Description if provided -->
        @if (description) {
        <p class="text-sm text-foreground-muted">
          {{ description }}
        </p>
        }

        <!-- Action button if provided -->
        @if (hasAction) {
        <div class="mt-2">
          <app-button
            [color]="actionButtonColor"
            size="sm"
            intensity="soft"
            (buttonClick)="onActionClick()"
          >
            {{ action!.label }}
          </app-button>
        </div>
        }
      </div>

      <!-- Close button if dismissible -->
      @if (dismissible) {
      <button
        type="button"
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
        (click)="onDismiss()"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 350px;
        animation: toast-enter 0.2s ease-out;
      }

      @keyframes toast-enter {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() message = '';
  @Input() description = '';
  @Input() type: 'default' | 'success' | 'error' | 'warning' | 'loading' =
    'default';
  @Input() duration = 4000;
  @Input() dismissible = true;
  @Input() action?: { label: string; onClick: () => void };
  @Input() icon?: string;
  @Input() className = '';

  @Output() dismiss = new EventEmitter<string>();

  private autoCloseTimeout?: any;

  ngOnInit(): void {
    if (this.duration > 0 && this.type !== 'loading') {
      this.setupAutoDismiss();
    }
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }

  onDismiss(): void {
    this.dismiss.emit(this.id);
  }

  onActionClick(): void {
    if (this.action) {
      this.action.onClick();
      // Auto dismiss after action click
      this.onDismiss();
    }
  }

  private setupAutoDismiss(): void {
    this.autoCloseTimeout = setTimeout(() => {
      this.onDismiss();
    }, this.duration);
  }

  get hasAction(): boolean {
    return !!this.action;
  }

  get actionButtonColor():
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'default' {
    switch (this.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  }
}
