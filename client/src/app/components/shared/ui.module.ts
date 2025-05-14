import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './primitives/button/button.component';
import { CardComponent } from './primitives/card/card.component';
import { ThemeToggleComponent } from './primitives/theme-toggle/theme-toggle.component';
import { InputComponent } from './primitives/input/input.component';
import { BadgeComponent } from './primitives/badge/badge.component';
import { AvatarComponent } from './primitives/avatar/avatar.component';
import { CheckboxComponent } from './primitives/checkbox/checkbox.component';
import { ToggleComponent } from './primitives/toggle/toggle.component';
import { RadioComponent } from './primitives/radio/radio.component';
import { RadioGroupComponent } from './primitives/radio-group/radio-group.component';
import { ToastComponent } from './primitives/toast/toast.component';
import { ToastProviderComponent } from './primitives/toast/toast-provider.component';
import { ToastDemoComponent } from './primitives/toast/toast-demo.component';
import { SelectComponent } from './primitives/select/select.component';
import { SelectOptionComponent } from './primitives/select/select-option.component';

// Import other components as needed

const COMPONENTS = [
  ButtonComponent,
  CardComponent,
  ThemeToggleComponent,
  InputComponent,
  BadgeComponent,
  AvatarComponent,
  CheckboxComponent,
  ToggleComponent,
  RadioComponent,
  RadioGroupComponent,
  ToastComponent,
  ToastProviderComponent,
  ToastDemoComponent,
  SelectComponent,
  SelectOptionComponent,
  // Add more components here
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...COMPONENTS],
  exports: [...COMPONENTS, FormsModule, ReactiveFormsModule],
})
export class UIModule {}
