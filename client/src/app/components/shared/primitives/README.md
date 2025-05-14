# ZoneVitae UI Component Library

This is a UI component library for the ZoneVitae application based on Tailwind CSS v4 with a customizable theme system.

## Features

- Fully compatible with Tailwind CSS v4
- Dark mode support (light/dark/system)
- Customizable components using design tokens
- Consistent styling across the application
- Angular-specific implementation
- Form components with proper Angular form integration

## Theme System

The library uses CSS variables to define theme colors and other design tokens. The theme can be toggled between light, dark, and system modes.

### Color Variants

- `default`
- `primary`
- `secondary`
- `success`
- `warning`
- `danger`

### Size Variants

- `xs`
- `sm`
- `md` (default)
- `lg`
- `xl`

### Intensity Variants

- `solid` (default)
- `soft`
- `outline`
- `ghost`

## Available Components

### Button

A versatile button component with various styles and states:

```html
<app-button color="primary" size="md" intensity="solid" (buttonClick)="handleClick()">
  Click Me
</app-button>
```

### Input

A form input component:

```html
<app-input
  label="Username"
  placeholder="Enter username"
  [validation]="{ state: 'invalid', message: 'Username is required' }"
  [fullWidth]="true"
  [(value)]="username">
</app-input>
```

### Card

A container component for grouping related content:

```html
<app-card [bordered]="true" shadow="md">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</app-card>
```

### Theme Toggle

A component to switch between light, dark, and system themes:

```html
<app-theme-toggle></app-theme-toggle>
```

## Using the UI Module

To use the UI components in any Angular component, import the UIModule:

```typescript
import { UIModule } from './components/shared/ui.module';

@NgModule({
  imports: [
    UIModule,
    // other imports
  ],
})
export class YourModule { }
```

## Theme Usage in Tailwind Classes

This library leverages Tailwind's utility classes with your theme variables:

- `bg-primary`: Primary background color
- `text-danger`: Danger text color
- `border-success`: Success border color
- `bg-content1`: Content level 1 background
- `text-content1-foreground`: Content level 1 foreground text
