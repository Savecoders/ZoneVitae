import {
  Injectable,
  TemplateRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  Injector,
  Type,
} from '@angular/core';
import { DialogComponent } from '../components/shared/primitives/dialog/dialog.component';
import { Subject } from 'rxjs';

export interface DialogOptions {
  title?: string;
  content?: string | TemplateRef<any>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  cancelButtonColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  showHeader?: boolean;
  showFooter?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  scrollable?: boolean;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  data?: any;
}

export interface DialogRef {
  close: () => void;
  onConfirm: Subject<void>;
  onCancel: Subject<void>;
  onClosed: Subject<void>;
  _componentRef?: any; // Expose component reference for debugging
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {}

  /**
   * Open a dialog with the given options
   */
  open(options: DialogOptions): DialogRef {
    const onConfirm = new Subject<void>();
    const onCancel = new Subject<void>();
    const onClosed = new Subject<void>();

    // Create the dialog component
    const componentRef = createComponent(DialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: document.createElement('div'),
      elementInjector: this.injector,
    });

    // Set the dialog options
    const instance = componentRef.instance;

    instance.isOpen = true;
    instance.title = options.title || '';
    instance.size = options.size || 'md';
    instance.confirmButtonText = options.confirmButtonText || 'Confirm';
    instance.cancelButtonText = options.cancelButtonText || 'Cancel';
    instance.confirmButtonColor = options.confirmButtonColor || 'primary';
    instance.cancelButtonColor = options.cancelButtonColor || 'default';
    instance.showHeader =
      options.showHeader !== undefined ? options.showHeader : true;
    instance.showFooter =
      options.showFooter !== undefined ? options.showFooter : true;
    instance.showCancelButton =
      options.showCancelButton !== undefined ? options.showCancelButton : true;
    instance.showConfirmButton =
      options.showConfirmButton !== undefined
        ? options.showConfirmButton
        : true;
    instance.showCloseButton =
      options.showCloseButton !== undefined ? options.showCloseButton : true;
    instance.closeOnBackdropClick =
      options.closeOnBackdropClick !== undefined
        ? options.closeOnBackdropClick
        : true;
    instance.closeOnEsc =
      options.closeOnEsc !== undefined ? options.closeOnEsc : true;
    instance.scrollable =
      options.scrollable !== undefined ? options.scrollable : true;
    instance.className = options.className || '';
    instance.contentClassName = options.contentClassName || '';
    instance.overlayClassName = options.overlayClassName || '';

    // Set the content template if it exists
    if (options.content) {
      if (options.content instanceof TemplateRef) {
        instance.contentTemplate = options.content;
      } else if (typeof options.content === 'string') {
        // Set text content (to be handled in the template)
        instance.content = options.content;
      }
    }

    // Handle dialog events
    instance.confirm.subscribe(() => {
      onConfirm.next();
    });

    instance.cancel.subscribe(() => {
      onCancel.next();
    });

    instance.closed.subscribe(() => {
      onClosed.next();
      setTimeout(() => {
        // Cleanup after animation completes
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }, 300);
    });

    // Add to DOM and attach to ApplicationRef
    document.body.appendChild(componentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);

    // Return the dialog reference with the component reference for debugging
    return {
      close: () => {
        instance.close();
      },
      onConfirm,
      onCancel,
      onClosed,
      _componentRef: componentRef,
    };
  }

  /**
   * Open a confirmation dialog
   */
  confirm(message: string, options: Partial<DialogOptions> = {}): DialogRef {
    return this.open({
      title: options.title || 'Confirm',
      content: message,
      size: 'sm',
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'No',
      confirmButtonColor: options.confirmButtonColor || 'primary',
      ...options,
    });
  }

  /**
   * Open a success dialog
   */
  success(message: string, options: Partial<DialogOptions> = {}): DialogRef {
    return this.open({
      title: options.title || 'Success',
      content: message,
      size: 'sm',
      confirmButtonText: options.confirmButtonText || 'OK',
      showCancelButton: false,
      confirmButtonColor: 'success',
      ...options,
    });
  }

  /**
   * Open an error dialog
   */
  error(message: string, options: Partial<DialogOptions> = {}): DialogRef {
    return this.open({
      title: options.title || 'Error',
      content: message,
      size: 'sm',
      confirmButtonText: options.confirmButtonText || 'OK',
      showCancelButton: false,
      confirmButtonColor: 'danger',
      ...options,
    });
  }

  /**
   * Open a delete confirmation dialog
   */
  delete(message: string, options: Partial<DialogOptions> = {}): DialogRef {
    return this.open({
      title: options.title || 'Confirm Deletion',
      content: message,
      size: 'sm',
      confirmButtonText: options.confirmButtonText || 'Delete',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      confirmButtonColor: 'danger',
      ...options,
    });
  }

  custom<T extends object>(
    component: Type<T>,
    options: Partial<DialogOptions> = {},
    componentProps?: Partial<T>
  ): DialogRef {
    // Create a div to hold our component
    const containerDiv = document.createElement('div');

    // Create the component instance
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
      hostElement: containerDiv,
      elementInjector: this.injector,
    });

    // Set component properties if provided
    if (componentProps) {
      Object.assign(componentRef.instance, componentProps);
    }

    // Render component to container
    this.appRef.attachView(componentRef.hostView);

    // Open dialog with the container div as content
    const dialogRef = this.open({
      ...options,
      content: containerDiv.innerHTML,
    });

    // Add cleanup for component
    dialogRef.onClosed.subscribe(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return dialogRef;
  }
}
