import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { HoverCardComponent } from '../hover-card/hover-card.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { DropdownMenuDemoComponent } from '../dropdown-menu/dropdown-menu-demo.component';
import { DialogService } from '../../../../services/dialog.service';
import {
  LucideAngularModule,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-ui-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    AlertDialogComponent,
    DialogComponent,
    HoverCardComponent,
    DropdownMenuComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="container mx-auto p-6 space-y-10">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-semibold mb-2">UI Components Showcase</h1>
        <p class="text-default-500">
          Examples of custom UI components using Angular 19 and Tailwind v4
        </p>
      </div>

      <!-- Alert Dialog Section -->
      <section class="border border-content2 rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold mb-4">Alert Dialog</h2>
        <p class="text-default-500 mb-6">
          Alert dialogs are used to confirm actions that might be destructive or
          important.
        </p>

        <div class="flex flex-wrap gap-3">
          <app-button color="primary" (buttonClick)="isAlertDialogOpen = true">
            Show Alert Dialog
          </app-button>
        </div>

        <app-alert-dialog
          [isOpen]="isAlertDialogOpen"
          title="Confirm Action"
          description="This action cannot be undone. Are you sure you want to continue?"
          confirmButtonText="Continue"
          cancelButtonText="Cancel"
          (confirm)="handleAlertConfirm()"
          (cancel)="isAlertDialogOpen = false"
          (closed)="isAlertDialogOpen = false"
        ></app-alert-dialog>
      </section>

      <!-- Hover Card Section -->
      <section class="border border-content2 rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold mb-4">Hover Card</h2>
        <p class="text-default-500 mb-6">
          Hover cards display floating content when users hover over a trigger
          element.
        </p>

        <div class="flex flex-wrap justify-center gap-8">
          <app-hover-card>
            <app-button trigger color="secondary">Hover Me</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Hover Card</h3>
              <p class="text-sm text-default-500 mt-2">
                This content appears when you hover over the button. Hover cards
                are great for providing additional context without requiring a
                click.
              </p>
            </div>
          </app-hover-card>

          <app-hover-card placement="top">
            <app-button trigger color="success">Top Placement</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Top Placement</h3>
              <p class="text-sm text-default-500 mt-2">
                This hover card appears above the trigger element instead of
                below it.
              </p>
            </div>
          </app-hover-card>
        </div>
      </section>

      <!-- Dialog Section -->
      <section class="border border-content2 rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold mb-4">Dialog</h2>
        <p class="text-default-500 mb-6">
          Dialogs display content that requires user attention or interaction.
        </p>

        <div class="flex flex-wrap gap-3">
          <app-button color="primary" (buttonClick)="isDialogOpen = true">
            Show Dialog
          </app-button>
          <app-button color="secondary" (buttonClick)="openDialogWithService()">
            Open With Dialog Service
          </app-button>
          <app-button color="danger" (buttonClick)="openDeleteDialog()">
            Delete Dialog
          </app-button>
        </div>

        <app-dialog
          [isOpen]="isDialogOpen"
          title="Dialog Example"
          (confirm)="handleDialogConfirm()"
          (cancel)="isDialogOpen = false"
          (closed)="isDialogOpen = false"
        >
          <div class="space-y-4">
            <p>
              This is a dialog component that can be used to display important
              content or gather user input. It has built-in support for headers,
              footers, and customizable buttons.
            </p>
            <p>
              Dialogs can be opened directly in templates or programmatically
              using the DialogService.
            </p>
          </div>
        </app-dialog>
      </section>

      <!-- Dropdown Menu Section -->
      <section class="border border-content2 rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold mb-4">Dropdown Menu</h2>
        <p class="text-default-500 mb-6">
          Dropdown menus display a list of actions or options when triggered.
        </p>

        <div class="flex flex-wrap gap-8 mb-8">
          <!-- Basic dropdown -->
          <div>
            <h3 class="text-md font-medium mb-3">Basic Dropdown</h3>
            <app-dropdown-menu
              [items]="basicDropdownItems"
              label="Actions"
              (itemSelected)="handleDropdownItemSelected($event)"
            ></app-dropdown-menu>
          </div>

          <!-- Account dropdown like in the reference image -->
          <div>
            <h3 class="text-md font-medium mb-3">Account Menu</h3>
            <app-dropdown-menu
              [items]="accountDropdownItems"
              label="My Account"
              (itemSelected)="handleDropdownItemSelected($event)"
            ></app-dropdown-menu>
          </div>

          <!-- Custom styling -->
          <div>
            <h3 class="text-md font-medium mb-3">Custom Style</h3>
            <app-dropdown-menu
              [items]="basicDropdownItems"
              label="Custom"
              [buttonClass]="customDropdownButtonClass"
              [menuClass]="customDropdownMenuClass"
              (itemSelected)="handleDropdownItemSelected($event)"
            ></app-dropdown-menu>
          </div>
        </div>

        <div class="mt-4 p-3 bg-default-100 rounded">
          @if (lastSelectedDropdownItem) {
          <p class="text-sm text-default-500">
            Last selected:
            <span class="text-default-700 font-medium">{{
              lastSelectedDropdownItem.label
            }}</span>
          </p>
          } @else {
          <p class="text-sm text-default-500">No item selected yet</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class UiShowcaseComponent {
  isAlertDialogOpen = false;
  isDialogOpen = false;
  lastSelectedDropdownItem: any = null;

  // Dropdown items
  basicDropdownItems = [
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive' },
    { id: 'divider1', divider: true },
    { id: 'delete', label: 'Delete', disabled: true },
  ];

  accountDropdownItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon, shortcut: '⌘ P' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘ S' },
    { id: 'divider1', divider: true },
    { id: 'logout', label: 'Log out', icon: LogOutIcon, shortcut: '⌘ O' },
  ];

  // Custom styles for dropdown
  customDropdownButtonClass =
    'inline-flex justify-center w-full rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary';
  customDropdownMenuClass =
    'bg-default-100 text-default-700 max-h-60 rounded-lg shadow-xl';

  constructor(private dialogService: DialogService) {}

  handleAlertConfirm(): void {
    console.log('Alert dialog confirmed');
    this.isAlertDialogOpen = false;
  }

  handleDialogConfirm(): void {
    console.log('Dialog confirmed');
    this.isDialogOpen = false;
  }

  openDialogWithService(): void {
    const dialogRef = this.dialogService.open({
      title: 'Dialog Service Example',
      content:
        'This dialog was opened using the DialogService. It provides a convenient API for opening dialogs programmatically.',
      size: 'md',
    });

    dialogRef.onConfirm.subscribe(() => {
      console.log('Service dialog confirmed');
    });

    dialogRef.onCancel.subscribe(() => {
      console.log('Service dialog cancelled');
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialogService.delete(
      'This action cannot be undone. This will permanently delete the item and remove all associated data.'
    );

    dialogRef.onConfirm.subscribe(() => {
      console.log('Item deleted');
    });
  }

  handleDropdownItemSelected(item: any): void {
    console.log('Dropdown item selected:', item);
    this.lastSelectedDropdownItem = item;
  }
}
