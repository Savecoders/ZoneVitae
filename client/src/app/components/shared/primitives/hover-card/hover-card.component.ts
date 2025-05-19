import {
  Component,
  Input,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export type HoverCardPlacement = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-hover-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative inline-block"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
    >
      <!-- Trigger element -->
      <div class="hover-card-trigger">
        <ng-content select="[trigger]"></ng-content>
      </div>

      <!-- Card content -->
      @if (isVisible) {
      <div
        class="absolute z-50 min-w-[200px] bg-content1 rounded-lg shadow-lg border border-content3 p-4"
        [ngClass]="[placementClasses, className]"
        [style.transition]="
          'opacity 150ms ease-in-out, transform 150ms ease-in-out'
        "
        [style.opacity]="isVisible ? '1' : '0'"
        [style.transform]="isVisible ? 'scale(1)' : 'scale(0.95)'"
      >
        <ng-content select="[content]"></ng-content>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .hover-card-trigger {
        display: inline-block;
      }
    `,
  ],
})
export class HoverCardComponent {
  @Input() placement: HoverCardPlacement = 'bottom';
  @Input() openDelay = 300;
  @Input() closeDelay = 200;
  @Input() className = '';

  isVisible = false;
  private openTimeout: any;
  private closeTimeout: any;
  private isBrowser: boolean;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get placementClasses(): string {
    const placements: Record<HoverCardPlacement, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 translate-x-2 ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2 mr-2',
    };

    return placements[this.placement];
  }

  onMouseEnter(): void {
    this.clearTimeouts();
    this.openTimeout = setTimeout(() => {
      this.isVisible = true;
    }, this.openDelay);
  }

  onMouseLeave(): void {
    this.clearTimeouts();
    this.closeTimeout = setTimeout(() => {
      this.isVisible = false;
    }, this.closeDelay);
  }

  private clearTimeouts(): void {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Hide the hover card when scrolling
    if (this.isBrowser && this.isVisible) {
      this.isVisible = false;
    }
  }
}
