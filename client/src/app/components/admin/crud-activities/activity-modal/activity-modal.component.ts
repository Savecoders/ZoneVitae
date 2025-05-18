import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/primitives/button/button.component';
import { InputComponent } from '../../../shared/primitives/input/input.component';

@Component({
  selector: 'app-activity-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div
      *ngIf="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        (click)="closeModal()"
      ></div>

      <!-- Modal content -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl z-10 overflow-hidden relative"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-medium">
            {{ isEditing ? 'Edit' : 'Add' }} Activity
          </h3>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            (click)="closeModal()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 max-h-[70vh] overflow-y-auto">
          <form [formGroup]="form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div class="md:col-span-2">
                <app-input
                  formControlName="nombre"
                  label="Activity Name"
                  placeholder="Enter activity name"
                  [required]="true"
                  [validation]="
                    form.get('nombre')?.touched && form.get('nombre')?.invalid
                      ? {
                          state: 'invalid',
                          message:
                            'Activity name is required (min 3 characters)'
                        }
                      : { state: 'undefined', message: '' }
                  "
                  [fullWidth]="true"
                ></app-input>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-2"
                    >Description</label
                  >
                  <textarea
                    formControlName="descripcion"
                    placeholder="Enter activity description"
                    rows="3"
                    class="w-full rounded-md border border-default-300 focus:border-primary focus:ring-2 ring-primary-200 py-2 px-4 bg-content1"
                  ></textarea>
                </div>
              </div>

              <!-- Start Date -->
              <div>
                <app-input
                  formControlName="fecha_inicio"
                  label="Start Date"
                  type="date"
                  [required]="true"
                  [fullWidth]="true"
                  [validation]="
                    form.get('fecha_inicio')?.touched &&
                    form.get('fecha_inicio')?.invalid
                      ? { state: 'invalid', message: 'Start date is required' }
                      : { state: 'undefined', message: '' }
                  "
                ></app-input>
              </div>

              <!-- End Date -->
              <div>
                <app-input
                  formControlName="fecha_fin"
                  label="End Date"
                  type="date"
                  [required]="true"
                  [fullWidth]="true"
                  [validation]="
                    form.get('fecha_fin')?.touched &&
                    form.get('fecha_fin')?.invalid
                      ? { state: 'invalid', message: 'End date is required' }
                      : { state: 'undefined', message: '' }
                  "
                ></app-input>
              </div>

              <!-- Location -->
              <div>
                <app-input
                  formControlName="ubicacion"
                  label="Location"
                  placeholder="Enter activity location"
                  [required]="true"
                  [fullWidth]="true"
                  [validation]="
                    form.get('ubicacion')?.touched &&
                    form.get('ubicacion')?.invalid
                      ? { state: 'invalid', message: 'Location is required' }
                      : { state: 'undefined', message: '' }
                  "
                ></app-input>
              </div>

              <!-- Frequency -->
              <div>
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-2">
                    Frequency
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    formControlName="frecuencia"
                    class="w-full rounded-md border border-default-300 focus:border-primary focus:ring-2 ring-primary-200 py-2 px-4 bg-content1"
                  >
                    <option value="" disabled>Select frequency</option>
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <div
                    *ngIf="
                      form.get('frecuencia')?.touched &&
                      form.get('frecuencia')?.invalid
                    "
                    class="text-red-500 text-sm mt-1"
                  >
                    Frequency is required
                  </div>
                </div>
              </div>

              <!-- Virtual Checkbox -->
              <div class="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="virtual-checkbox"
                  formControlName="virtual"
                  class="h-4 w-4 rounded border-default-400 text-primary focus:ring-primary"
                />
                <label
                  for="virtual-checkbox"
                  class="ml-2 text-sm text-default-700"
                >
                  Virtual Activity
                </label>
              </div>

              <!-- URL -->
              <div class="md:col-span-2" *ngIf="form.get('virtual')?.value">
                <app-input
                  formControlName="url"
                  label="URL"
                  placeholder="Enter activity URL"
                  type="url"
                  [fullWidth]="true"
                ></app-input>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700"
        >
          <app-button
            [color]="'default'"
            intensity="ghost"
            (buttonClick)="closeModal()"
          >
            Cancel
          </app-button>
          <app-button
            [color]="isEditing ? 'primary' : 'success'"
            [loading]="loading"
            (buttonClick)="saveActivity()"
          >
            {{ isEditing ? 'Update' : 'Save' }} Activity
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class ActivityModalComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() loading = false;
  @Input() set activityData(data: any) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      ubicacion: ['', Validators.required],
      virtual: [false],
      frecuencia: ['', Validators.required],
      comunidad_id: [null],
      url: [''],
    });
  }

  saveActivity() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  closeModal() {
    this.cancel.emit();
  }

  resetForm() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      ubicacion: '',
      virtual: false,
      frecuencia: '',
      comunidad_id: null,
      url: '',
    });
  }
}
