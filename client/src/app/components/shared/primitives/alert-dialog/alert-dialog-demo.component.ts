import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AlertDialogComponent } from './alert-dialog.component';

@Component({
  selector: 'app-alert-dialog-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AlertDialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap gap-3">
        <app-button color="primary" (buttonClick)="showDefaultAlert()">
          Show Default Alert
        </app-button>
        <app-button color="danger" (buttonClick)="showDangerAlert()">
          Show Danger Alert
        </app-button>
        <app-button color="warning" (buttonClick)="showWarningAlert()">
          Show Warning Alert
        </app-button>
      </div>

      <!-- Default Alert Dialog -->
      <app-alert-dialog
        [isOpen]="isDefaultAlertOpen"
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        (confirm)="onDefaultConfirm()"
        (cancel)="onDefaultCancel()"
        (closed)="onDefaultClosed()"
      ></app-alert-dialog>

      <!-- Danger Alert Dialog -->
      <app-alert-dialog
        [isOpen]="isDangerAlertOpen"
        title="Delete Item"
        description="This action cannot be undone. Are you sure you want to delete this item?"
        confirmButtonText="Delete"
        confirmButtonColor="danger"
        (confirm)="onDangerConfirm()"
        (cancel)="onDangerCancel()"
      ></app-alert-dialog>

      <!-- Warning Alert Dialog -->
      <app-alert-dialog
        [isOpen]="isWarningAlertOpen"
        title="Warning"
        description="This will log you out from all devices. Do you want to continue?"
        confirmButtonText="Continue"
        confirmButtonColor="warning"
        (confirm)="onWarningConfirm()"
        (cancel)="onWarningCancel()"
      ></app-alert-dialog>
    </div>
  `,
})
export class AlertDialogDemoComponent {
  isDefaultAlertOpen = false;
  isDangerAlertOpen = false;
  isWarningAlertOpen = false;

  showDefaultAlert(): void {
    this.isDefaultAlertOpen = true;
  }

  showDangerAlert(): void {
    this.isDangerAlertOpen = true;
  }

  showWarningAlert(): void {
    this.isWarningAlertOpen = true;
  }

  onDefaultConfirm(): void {
    console.log('Default alert confirmed');
  }

  onDefaultCancel(): void {
    console.log('Default alert cancelled');
  }

  onDefaultClosed(): void {
    this.isDefaultAlertOpen = false;
  }

  onDangerConfirm(): void {
    console.log('Danger alert confirmed');
    this.isDangerAlertOpen = false;
  }

  onDangerCancel(): void {
    console.log('Danger alert cancelled');
    this.isDangerAlertOpen = false;
  }

  onWarningConfirm(): void {
    console.log('Warning alert confirmed');
    this.isWarningAlertOpen = false;
  }

  onWarningCancel(): void {
    console.log('Warning alert cancelled');
    this.isWarningAlertOpen = false;
  }
}
