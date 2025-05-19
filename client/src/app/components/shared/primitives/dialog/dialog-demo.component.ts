import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DialogComponent],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold mb-4">Dialog Component</h2>

      <div class="flex flex-wrap gap-3">
        <app-button color="primary" (buttonClick)="openBasicDialog()">
          Basic Dialog
        </app-button>
        <app-button color="secondary" (buttonClick)="openSizesDialog()">
          Different Sizes
        </app-button>
        <app-button color="success" (buttonClick)="openCustomHeaderDialog()">
          Custom Header
        </app-button>
        <app-button color="warning" (buttonClick)="openScrollableDialog()">
          Scrollable Content
        </app-button>
        <app-button color="danger" (buttonClick)="openDeleteDialog()">
          Delete Dialog
        </app-button>
      </div>

      <!-- Basic Dialog -->
      <app-dialog
        [isOpen]="isBasicDialogOpen"
        title="Basic Dialog"
        (confirm)="onConfirm('basic')"
        (cancel)="onCancel('basic')"
        (closed)="isBasicDialogOpen = false"
      >
        <p>This is a basic dialog with default header and footer.</p>
        <p class="mt-2">Click confirm or cancel to close the dialog.</p>
      </app-dialog>

      <!-- Sizes Dialog -->
      <app-dialog
        [isOpen]="isSizesDialogOpen"
        [size]="selectedSize"
        title="Dialog Sizes"
        (confirm)="onConfirm('sizes')"
        (cancel)="onCancel('sizes')"
        (closed)="isSizesDialogOpen = false"
      >
        <div>
          <p class="mb-4">Select a dialog size:</p>
          <div class="flex flex-wrap gap-2">
            <app-button> color="secondary" </app-button>
            <app-button
              color="secondary"
              [intensity]="selectedSize === 'md' ? 'solid' : 'soft'"
              (buttonClick)="('')"
            >
              Medium
            </app-button>
            <app-button
              color="secondary"
              [intensity]="selectedSize === 'lg' ? 'solid' : 'soft'"
            >
              Large
            </app-button>
            <app-button
              color="secondary"
              [intensity]="selectedSize === 'xl' ? 'solid' : 'soft'"
            >
              Extra Large
            </app-button>
            <app-button
              color="secondary"
              [intensity]="selectedSize === 'full' ? 'solid' : 'soft'"
            >
              Full Width
            </app-button>
          </div>
          <p class="mt-4">
            Current size: <span class="font-semibold">{{ selectedSize }}</span>
          </p>
        </div>
      </app-dialog>

      <!-- Custom Header Dialog -->
      <app-dialog
        [isOpen]="isCustomHeaderDialogOpen"
        [showHeader]="true"
        (confirm)="onConfirm('custom')"
        (cancel)="onCancel('custom')"
        (closed)="isCustomHeaderDialogOpen = false"
      >
        <ng-template #header>
          <div class="flex items-center gap-3 py-2">
            <div
              class="bg-primary-200 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-primary-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-foreground">
                Custom Dialog Header
              </h2>
              <p class="text-xs text-default-500">With icon and subtitle</p>
            </div>
          </div>
        </ng-template>

        <p>This dialog has a custom header with an icon and subtitle.</p>
        <p class="mt-2">
          You can fully customize the header, content, and footer using
          templates.
        </p>
      </app-dialog>

      <!-- Scrollable Content Dialog -->
      <app-dialog
        [isOpen]="isScrollableDialogOpen"
        title="Scrollable Content"
        [scrollable]="true"
        (confirm)="onConfirm('scroll')"
        (cancel)="onCancel('scroll')"
        (closed)="isScrollableDialogOpen = false"
      >
        <div class="space-y-4">
          <p>This dialog demonstrates scrollable content with a lot of text.</p>

          @for(i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i) {
          <div class="border border-content2 rounded-md p-3">
            <h3 class="font-semibold mb-2">Section {{ i }}</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              euismod, nisi vel consectetur euismod, nisi vel consectetur
              euismod, nisi vel consectetur euismod, nisi vel consectetur
              euismod.
            </p>
          </div>
          }
        </div>
      </app-dialog>

      <!-- Delete Dialog -->
      <app-dialog
        [isOpen]="isDeleteDialogOpen"
        title="Confirm Deletion"
        confirmButtonText="Delete"
        confirmButtonColor="danger"
        (confirm)="onDeleteConfirm()"
        (cancel)="isDeleteDialogOpen = false"
        (closed)="isDeleteDialogOpen = false"
      >
        <div class="text-center py-4">
          <div
            class="bg-danger-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-danger-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">
            Are you sure you want to delete this item?
          </h3>
          <p class="text-default-500">
            This action cannot be undone. This will permanently delete the item
            and remove all associated data.
          </p>
        </div>
      </app-dialog>
    </div>
  `,
})
export class DialogDemoComponent {
  isBasicDialogOpen = false;
  isSizesDialogOpen = false;
  isCustomHeaderDialogOpen = false;
  isScrollableDialogOpen = false;
  isDeleteDialogOpen = false;

  selectedSize: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

  openBasicDialog(): void {
    this.isBasicDialogOpen = true;
  }

  openSizesDialog(): void {
    this.isSizesDialogOpen = true;
  }

  openCustomHeaderDialog(): void {
    this.isCustomHeaderDialogOpen = true;
  }

  openScrollableDialog(): void {
    this.isScrollableDialogOpen = true;
  }

  openDeleteDialog(): void {
    this.isDeleteDialogOpen = true;
  }

  onConfirm(type: string): void {
    console.log(`${type} dialog confirmed`);

    switch (type) {
      case 'basic':
        this.isBasicDialogOpen = false;
        break;
      case 'sizes':
        this.isSizesDialogOpen = false;
        break;
      case 'custom':
        this.isCustomHeaderDialogOpen = false;
        break;
      case 'scroll':
        this.isScrollableDialogOpen = false;
        break;
    }
  }

  onCancel(type: string): void {
    console.log(`${type} dialog cancelled`);

    switch (type) {
      case 'basic':
        this.isBasicDialogOpen = false;
        break;
      case 'sizes':
        this.isSizesDialogOpen = false;
        break;
      case 'custom':
        this.isCustomHeaderDialogOpen = false;
        break;
      case 'scroll':
        this.isScrollableDialogOpen = false;
        break;
    }
  }

  onDeleteConfirm(): void {
    console.log('Item deleted!');
    this.isDeleteDialogOpen = false;
    // In a real app, you would call a service to delete the item
  }
}
