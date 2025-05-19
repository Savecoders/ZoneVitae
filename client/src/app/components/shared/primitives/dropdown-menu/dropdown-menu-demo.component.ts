import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenuComponent, DropdownItem } from './dropdown-menu.component';
import {
  LucideAngularModule,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  KeyboardIcon,
  UsersIcon,
  UserPlusIcon,
  UserRoundPlusIcon,
  GithubIcon,
  HelpCircleIcon,
  LogOutIcon,
  ChevronRightIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-dropdown-menu-demo',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent, LucideAngularModule],
  template: `
    <div class="space-y-8 p-8">
      <h2 class="text-2xl font-semibold mb-4">Dropdown Menu Component</h2>

      <div class="flex flex-wrap gap-8">
        <!-- Basic Dropdown -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Basic Dropdown</h3>
          <app-dropdown-menu
            [items]="basicItems"
            label="Open"
            (itemSelected)="onItemSelected($event)"
          ></app-dropdown-menu>
        </div>

        <!-- Account Dropdown (like the reference image) -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Account Menu</h3>
          <app-dropdown-menu
            [items]="accountItems"
            label="My Account"
            (itemSelected)="onItemSelected($event)"
          ></app-dropdown-menu>
        </div>

        <!-- Right-aligned Dropdown -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Right-aligned</h3>
          <app-dropdown-menu
            [items]="basicItems"
            label="Actions"
            align="right"
            (itemSelected)="onItemSelected($event)"
          ></app-dropdown-menu>
        </div>

        <!-- Custom Style Dropdown -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Custom Style</h3>
          <app-dropdown-menu
            [items]="basicItems"
            label="Custom"
            [buttonClass]="customButtonClass"
            [menuClass]="customMenuClass"
            (itemSelected)="onItemSelected($event)"
          ></app-dropdown-menu>
        </div>

        <!-- Selection Dropdown -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">With Selection</h3>
          <app-dropdown-menu
            [items]="selectionItems"
            label="Select Item"
            [showSelectedCheck]="true"
            [selectedItem]="selectedItem"
            (itemSelected)="onSelectionChanged($event)"
          ></app-dropdown-menu>
        </div>
      </div>

      <div class="mt-8 p-4 bg-default-100 rounded-lg">
        <h3 class="text-lg font-medium mb-2">Selected Item:</h3>
        @if (lastSelectedItem) {
        <pre class="bg-default-200 p-3 rounded text-sm">{{
          lastSelectedItem | json
        }}</pre>
        } @else {
        <p class="text-default-500">No item selected yet</p>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class DropdownMenuDemoComponent {
  // Basic dropdown items
  basicItems: DropdownItem[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'delete', label: 'Delete', disabled: true },
    { id: 'divider1', divider: true },
    { id: 'export', label: 'Export' },
  ];

  // Account dropdown items (like in the reference image)
  accountItems: DropdownItem[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon, shortcut: '⌘ P' },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon, shortcut: '⌘ B' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘ S' },
    {
      id: 'keyboard',
      label: 'Keyboard shortcuts',
      icon: KeyboardIcon,
      shortcut: '⌘ K',
    },
    { id: 'divider1', divider: true },
    { id: 'team', label: 'Team' },
    { id: 'invite', label: 'Invite users', icon: UserPlusIcon },
    {
      id: 'newTeam',
      label: 'New Team',
      icon: UserRoundPlusIcon,
      shortcut: '⌘ T',
    },
    { id: 'divider2', divider: true },
    { id: 'github', label: 'GitHub', icon: GithubIcon },
    { id: 'support', label: 'Support', icon: HelpCircleIcon },
    { id: 'divider3', divider: true },
    { id: 'logout', label: 'Log out', icon: LogOutIcon, shortcut: '⌘ O' },
  ];

  // Selection dropdown items
  selectionItems: DropdownItem[] = [
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' },
    { id: 'option4', label: 'Option 4' },
  ];

  selectedItem: DropdownItem | null = null;
  lastSelectedItem: DropdownItem | null = null;

  // Custom styles
  customButtonClass =
    'inline-flex justify-center w-full rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary';
  customMenuClass =
    'bg-default-100 text-default-700 max-h-60 rounded-lg shadow-xl';

  onItemSelected(item: DropdownItem): void {
    console.log('Item selected:', item);
    this.lastSelectedItem = item;
  }

  onSelectionChanged(item: DropdownItem): void {
    this.selectedItem = item;
    this.lastSelectedItem = item;
  }
}
