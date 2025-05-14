import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap gap-3">
        <app-button color="default" (buttonClick)="showDefault()">
          Show Toast
        </app-button>
        <app-button color="success" (buttonClick)="showSuccess()">
          Show Success
        </app-button>
        <app-button color="danger" (buttonClick)="showError()">
          Show Error
        </app-button>
        <app-button color="warning" (buttonClick)="showWarning()">
          Show Warning
        </app-button>
      </div>

      <div class="flex flex-wrap gap-3">
        <app-button color="primary" (buttonClick)="showLoading()">
          Show Loading
        </app-button>
        <app-button color="primary" (buttonClick)="showPromiseToast()">
          Promise Toast
        </app-button>
        <app-button color="primary" (buttonClick)="showActionToast()">
          Toast with Action
        </app-button>
      </div>

      <div class="flex flex-wrap gap-3">
        <app-button
          color="secondary"
          (buttonClick)="changePosition('top-right')"
        >
          Top Right
        </app-button>
        <app-button
          color="secondary"
          (buttonClick)="changePosition('top-center')"
        >
          Top Center
        </app-button>
        <app-button
          color="secondary"
          (buttonClick)="changePosition('top-left')"
        >
          Top Left
        </app-button>
        <app-button
          color="secondary"
          (buttonClick)="changePosition('bottom-right')"
        >
          Bottom Right
        </app-button>
        <app-button
          color="secondary"
          (buttonClick)="changePosition('bottom-center')"
        >
          Bottom Center
        </app-button>
        <app-button
          color="secondary"
          (buttonClick)="changePosition('bottom-left')"
        >
          Bottom Left
        </app-button>
      </div>
    </div>
  `,
})
export class ToastDemoComponent {
  constructor(private toastService: ToastService) {}

  showDefault(): void {
    this.toastService.show('This is a default toast message');
  }

  showSuccess(): void {
    this.toastService.success('Operation completed successfully');
  }

  showError(): void {
    this.toastService.error('An error occurred');
  }

  showWarning(): void {
    this.toastService.warning('Please proceed with caution');
  }

  showLoading(): void {
    const id = this.toastService.loading('Processing your request...');

    // Simulate completion after 3 seconds
    setTimeout(() => {
      this.toastService.remove(id);
      this.toastService.success('Process completed!');
    }, 3000);
  }

  showPromiseToast(): void {
    const fakePromise = new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // 80% success rate for demo purposes
        if (Math.random() > 0.2) {
          resolve({ data: 'Success data' });
        } else {
          reject(new Error('Failed to process request'));
        }
      }, 2000);
    });

    this.toastService.promise(fakePromise, {
      loading: 'Processing request...',
      success: (data) => 'Request completed successfully',
      error: (err) => `Error: ${err.message}`,
    });
  }

  showActionToast(): void {
    this.toastService.show('New notification received', {
      action: {
        label: 'View',
        onClick: () => {
          alert('Action clicked!');
        },
      },
    });
  }

  changePosition(
    position:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right'
  ): void {
    this.toastService.setPosition(position);
    this.toastService.show(`Toast position changed to ${position}`);
  }
}
