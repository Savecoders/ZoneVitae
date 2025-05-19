import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ElementRef,
  AfterViewInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ColorVariant } from '../../../../models/ui.model';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
    <div
      class="fixed inset-0 bg-overlay/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      [class]="overlayClassName"
      (click)="closeOnBackdropClick ? close() : null"
    >
      <div
        #dialogContainer
        class="bg-content1 rounded-lg shadow-lg flex flex-col border border-content3 w-full"
        [class]="[sizeClass, className]"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        @if (showHeader) {
        <div
          class="flex items-center justify-between p-4 border-b border-content2"
        >
          @if (title) {
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          } @else if (headerTemplate) {
          <ng-container [ngTemplateOutlet]="headerTemplate"></ng-container>
          } @if (showCloseButton) {
          <button
            class="text-default-500 hover:text-danger focus:outline-none"
            (click)="close()"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          }
        </div>
        }

        <!-- Content -->
        <div
          class="p-4 overflow-y-auto"
          [class]="contentClassName"
          [style.max-height]="scrollable ? '70vh' : 'auto'"
        >
          @if (contentTemplate) {
          <ng-container [ngTemplateOutlet]="contentTemplate"></ng-container>
          } @else if (content) {
          {{ content }}
          } @else {
          <ng-content></ng-content>
          }
        </div>

        <!-- Footer -->
        @if (showFooter) {
        <div class="flex justify-end gap-3 p-4 border-t border-content2">
          @if (footerTemplate) {
          <ng-container [ngTemplateOutlet]="footerTemplate"></ng-container>
          } @else { @if (showCancelButton) {
          <app-button
            [color]="cancelButtonColor"
            intensity="ghost"
            (buttonClick)="onCancel()"
          >
            {{ cancelButtonText }}
          </app-button>
          } @if (showConfirmButton) {
          <app-button
            [color]="confirmButtonColor"
            [loading]="loading"
            (buttonClick)="onConfirm()"
          >
            {{ confirmButtonText }}
          </app-button>
          } }
        </div>
        }
      </div>
    </div>
    }
  `,
})
export class DialogComponent implements AfterViewInit {
  @ViewChild('dialogContainer') dialogContainer!: ElementRef;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';
  @Input() confirmButtonColor: ColorVariant = 'primary';
  @Input() cancelButtonColor: ColorVariant = 'default';
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEsc = true;
  @Input() scrollable = true;
  @Input() loading = false;
  @Input() className = '';
  @Input() overlayClassName = '';
  @Input() contentClassName = '';
  @Input() content = ''; // For string content

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('footer') footerTemplate?: TemplateRef<any>;
  // Allow setting content template either through content child or directly through input
  @ContentChild('content') _contentTemplateFromContent?: TemplateRef<any>;
  @Input() set contentTemplate(template: TemplateRef<any> | undefined) {
    if (template) {
      this._contentTemplate = template;
    }
  }
  get contentTemplate(): TemplateRef<any> | undefined {
    return this._contentTemplate || this._contentTemplateFromContent;
  }
  private _contentTemplate?: TemplateRef<any>;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();

  private escListener?: (event: KeyboardEvent) => void;

  get sizeClass(): string {
    const sizes: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    };
    return sizes[this.size];
  }

  ngAfterViewInit(): void {
    // Only setup listener in browser environment
    if (this.closeOnEsc && this.isBrowser) {
      this.setupEscListener();
    }
  }

  private setupEscListener(): void {
    // Only run in browser environment
    if (this.isBrowser) {
      this.escListener = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.isOpen) {
          this.close();
        }
      };
      document.addEventListener('keydown', this.escListener);
    }
  }

  private removeEscListener(): void {
    if (this.escListener && this.isBrowser) {
      document.removeEventListener('keydown', this.escListener);
    }
  }

  open(): void {
    this.isOpen = true;
    this.setupEscListener();
    this.opened.emit();

    // Only modify DOM in browser environment
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
    this.removeEscListener();

    // Only modify DOM in browser environment
    if (this.isBrowser) {
      document.body.style.overflow = ''; // Allow scrolling again
    }
  }

  onConfirm(): void {
    this.confirm.emit();
    if (!this.loading) {
      this.close();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }
}
