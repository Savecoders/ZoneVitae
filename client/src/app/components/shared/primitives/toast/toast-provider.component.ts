import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  ToastService,
  Toast,
  ToastPosition,
} from '../../../../services/toast.service';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-toast-provider',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div
      class="toast-viewport fixed z-[100] flex flex-col gap-2 p-4"
      [class]="positionClasses"
    >
      @for (toast of toasts; track toast.id) {
      <app-toast
        [id]="toast.id"
        [message]="toast.message"
        [description]="toast.description ?? ''"
        [type]="toast.type"
        [duration]="toast.duration"
        [dismissible]="toast.dismissible"
        [action]="toast.action"
        [icon]="toast.icon"
        [className]="toast.className ?? ''"
        (dismiss)="onDismiss($event)"
      ></app-toast>
      }
    </div>
  `,
  styles: [
    `
      .toast-viewport {
        max-width: 420px;
        width: max-content;
      }

      /* Position classes for different viewport positions */
      .top-left {
        top: 0;
        left: 0;
      }
      .top-center {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .top-right {
        top: 0;
        right: 0;
      }
      .bottom-left {
        bottom: 0;
        left: 0;
      }
      .bottom-center {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .bottom-right {
        bottom: 0;
        right: 0;
      }
    `,
  ],
})
export class ToastProviderComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  position: ToastPosition = 'bottom-right';

  private toastsSubscription?: Subscription;
  private positionSubscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    // Subscribe to toasts
    this.toastsSubscription = this.toastService
      .getToasts()
      .subscribe((toasts) => {
        this.toasts = toasts;
      });

    // Subscribe to position changes
    this.positionSubscription = this.toastService
      .getPosition()
      .subscribe((position) => {
        this.position = position;
      });
  }

  ngOnDestroy(): void {
    this.toastsSubscription?.unsubscribe();
    this.positionSubscription?.unsubscribe();
  }

  onDismiss(id: string): void {
    this.toastService.remove(id);
  }

  get positionClasses(): string {
    switch (this.position) {
      case 'top-left':
        return 'top-left';
      case 'top-center':
        return 'top-center';
      case 'top-right':
        return 'top-right';
      case 'bottom-left':
        return 'bottom-left';
      case 'bottom-center':
        return 'bottom-center';
      case 'bottom-right':
      default:
        return 'bottom-right';
    }
  }
}
