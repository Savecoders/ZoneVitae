import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'loading';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration: number;
  dismissible: boolean;
  position: ToastPosition;
  createdAt: number;
  action?: ToastAction;
  onDismiss?: () => void;
  icon?: string;
  className?: string;
}

const DEFAULT_DURATION = 4000;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private position$ = new BehaviorSubject<ToastPosition>('bottom-right');

  constructor() {}

  /**
   * Get observable of all active toasts
   */
  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  /**
   * Get observable of toast position
   */
  getPosition(): Observable<ToastPosition> {
    return this.position$.asObservable();
  }

  /**
   * Set global toast position
   */
  setPosition(position: ToastPosition): void {
    this.position$.next(position);
  }

  /**
   * Show a default toast
   */
  show(message: string, options: Partial<Toast> = {}): string {
    return this.addToast({
      type: 'default',
      ...options,
      message,
    });
  }

  /**
   * Show a success toast
   */
  success(message: string, options: Partial<Toast> = {}): string {
    return this.addToast({
      type: 'success',
      ...options,
      message,
    });
  }

  /**
   * Show an error toast
   */
  error(message: string, options: Partial<Toast> = {}): string {
    return this.addToast({
      type: 'error',
      ...options,
      message,
    });
  }

  /**
   * Show a warning toast
   */
  warning(message: string, options: Partial<Toast> = {}): string {
    return this.addToast({
      type: 'warning',
      ...options,
      message,
    });
  }

  /**
   * Show a loading toast
   */
  loading(message: string, options: Partial<Toast> = {}): string {
    return this.addToast({
      type: 'loading',
      duration: 0, // Loading toasts don't auto-dismiss
      dismissible: false,
      ...options,
      message,
    });
  }

  /**
   * Promise-based toast that shows loading, success, or error states
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options: Partial<Toast> = {}
  ): Promise<T> {
    const toastId = this.loading(messages.loading, options);

    return promise
      .then((data) => {
        const successMessage =
          typeof messages.success === 'function'
            ? messages.success(data)
            : messages.success;

        this.remove(toastId);
        this.success(successMessage, options);
        return data;
      })
      .catch((error) => {
        const errorMessage =
          typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error;

        this.remove(toastId);
        this.error(errorMessage, options);
        throw error;
      });
  }

  /**
   * Update an existing toast
   */
  update(id: string, options: Partial<Toast>): void {
    const currentToasts = this.toasts$.value;
    const toastIndex = currentToasts.findIndex((t) => t.id === id);

    if (toastIndex !== -1) {
      const updatedToast = {
        ...currentToasts[toastIndex],
        ...options,
      };

      const updatedToasts = [
        ...currentToasts.slice(0, toastIndex),
        updatedToast,
        ...currentToasts.slice(toastIndex + 1),
      ];

      this.toasts$.next(updatedToasts);
    }
  }

  /**
   * Remove a toast by id
   */
  remove(id: string): void {
    const toast = this.toasts$.value.find((t) => t.id === id);

    if (toast?.onDismiss) {
      toast.onDismiss();
    }

    this.toasts$.next(this.toasts$.value.filter((toast) => toast.id !== id));
  }

  /**
   * Remove all toasts
   */
  clear(): void {
    this.toasts$.next([]);
  }

  /**
   * Add a toast with common options
   */
  private addToast(options: Partial<Toast>): string {
    const id = this.generateId();
    const position = options.position || this.position$.value;

    const toast: Toast = {
      id,
      message: '',
      type: 'default',
      duration: DEFAULT_DURATION,
      dismissible: true,
      position,
      createdAt: Date.now(),
      ...options,
    };

    this.toasts$.next([...this.toasts$.value, toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration);
    }

    return id;
  }

  /**
   * Generate a unique id for a toast
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
