import { InjectionToken } from '@angular/core';
import { ColorVariant, RadiusVariant, SizeVariant } from '../models/ui.model';

export interface UIConfig {
  defaultRadius: RadiusVariant;
  defaultSize: SizeVariant;
  defaultColor: ColorVariant;
  disabledOpacity: string;
  transitions: {
    default: string;
  };
}

export const DEFAULT_UI_CONFIG: UIConfig = {
  defaultRadius: 'md',
  defaultSize: 'md',
  defaultColor: 'primary',
  disabledOpacity: '0.8',
  transitions: {
    default: 'transition-all duration-200',
  },
};

export const UI_CONFIG = new InjectionToken<UIConfig>('ui-config');
