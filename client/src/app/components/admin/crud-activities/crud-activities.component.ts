import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ApplicationRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActividadService } from '../../../services/actividad.service';
import { Actividad } from '../../../models/actividad.model';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminLayoutComponent } from '../layout/layout.component';
import { ButtonComponent } from '../../shared/primitives/button/button.component';
import {
  MegaphoneIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpDownIcon,
  SearchIcon,
  LucideAngularModule,
  PencilLineIcon,
  Trash2Icon,
  EllipsisVertical,
} from 'lucide-angular';
import { InputComponent } from '../../shared/primitives/input/input.component';
import { SelectComponent } from '../../shared/primitives/select/select.component';
import { DialogComponent } from '../../shared/primitives/dialog/dialog.component';
import { DialogRef, DialogService } from '../../../services/dialog.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { BadgeComponent } from '../../shared/primitives/badge/badge.component';
import {
  DropdownMenuComponent,
  DropdownItem,
} from '../../shared/primitives/dropdown-menu/dropdown-menu.component';
import { SeparatorComponent } from '../../shared/primitives/separator/separator.component';

@Component({
  selector: 'app-crud-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminLayoutComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BadgeComponent,
    DropdownMenuComponent,
    LucideAngularModule,
    DialogComponent,
    SeparatorComponent,
  ],
  templateUrl: './crud-activities.component.html',
  styleUrl: './crud-activities.component.css',
})
export class CrudActivitiesComponent implements OnInit, OnDestroy {
  // icons
  IconActivities = MegaphoneIcon;
  IconLink = LinkIcon;
  IconEdit = PencilIcon;
  IconDelete = TrashIcon;
  IconSort = ArrowUpDownIcon;
  IconSearch = SearchIcon;
  IconOptions = EllipsisVertical;

  // Dropdown menu items
  actionItems: DropdownItem[] = [
    { id: 'edit', label: 'Edit', icon: PencilLineIcon },
    { id: 'delete', label: 'Delete', icon: Trash2Icon },
  ];

  activities: Actividad[] = [];
  activityForm: FormGroup;
  isEditing = false;
  currentActivityId?: number;
  searchTerm = '';
  isLoading = false;
  error: string | null = null;

  // Table configuration
  displayedColumns: string[] = [
    'nombre',
    'fecha_inicio',
    'fecha_fin',
    'ubicacion',
    'virtual',
    'url',
    'actions',
  ];
  dataSource = new MatTableDataSource<Actividad>([]);

  // Form status subscription
  formStatusSubscription?: Subscription;

  // Properties to track current dialog
  private currentDialogRef: DialogRef | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('activityFormTemplate') activityFormTemplate!: TemplateRef<any>;

  constructor(
    private actividadService: ActividadService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date();
    const todayFormatted = today.toISOString().substring(0, 10);

    this.activityForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        descripcion: ['', [Validators.minLength(10)]],
        fecha_inicio: [todayFormatted, Validators.required], // Set today as default
        fecha_fin: ['', Validators.required],
        ubicacion: ['', Validators.required],
        virtual: [false],
        frecuencia: ['', Validators.required],
        comunidad_id: [null],
        url: [
          '',
          [
            Validators.pattern(
              '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)(\\?[\\w%&=.-]*)?(#[\\w-]*)?'
            ),
          ],
        ],
      },
      { validators: this.dateRangeValidator }
    );
  }

  // Custom validator to ensure start date is before end date and not in the past
  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get('fecha_inicio')?.value;
    const end = group.get('fecha_fin')?.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time component for accurate date comparison

    const errors: { [key: string]: any } = {};

    if (start) {
      const startDate = new Date(start);

      // Check if start date is before today
      // We'll only apply this validation when the start date control has been modified by the user
      const startControl = group.get('fecha_inicio');
      if (startDate < today && startControl && startControl.dirty) {
        errors['startDatePast'] = true;
      }

      // Check if end date is after start date
      if (end) {
        const endDate = new Date(end);
        if (startDate > endDate) {
          errors['dateRangeInvalid'] = true;
        }
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  ngOnInit(): void {
    this.loadActivities();

    // Add conditional validation for URL field based on virtual checkbox
    this.activityForm.get('virtual')?.valueChanges.subscribe((isVirtual) => {
      const urlControl = this.activityForm.get('url');
      if (isVirtual) {
        urlControl?.setValidators([
          Validators.pattern(
            '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)(\\?[\\w%&=.-]*)?(#[\\w-]*)?'
          ),
        ]);
      } else {
        urlControl?.clearValidators();
      }
      urlControl?.updateValueAndValidity();
    });
  }

  ngAfterViewInit() {
    // Set up sorting and pagination once view is initialized
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  loadActivities(): void {
    this.isLoading = true;
    this.actividadService.getActividades().subscribe({
      next: (data) => {
        this.activities = data;
        this.dataSource.data = this.activities;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading activities: ' + err.message;
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddActivityDialog() {
    console.log('Opening Add Activity Dialog');
    this.isEditing = false;
    this.resetForm();

    // Create a dialog reference using the activityFormTemplate
    this.currentDialogRef = this.dialogService.open({
      title: 'Add New Activity',
      content: this.activityFormTemplate,
      size: 'lg',
      confirmButtonText: 'Save',
      confirmButtonColor: 'success',
      cancelButtonText: 'Cancel',
      showHeader: true,
      showFooter: true,
      confirmButtonDisabled: this.activityForm.invalid,
      data: {
        form: this.activityForm,
        isEditing: this.isEditing,
      },
    });

    // Debug the dialog reference
    console.log('Dialog reference created:', this.currentDialogRef);

    // Set up a form status subscription to update button state
    this.formStatusSubscription = this.activityForm.statusChanges.subscribe(
      (status) => {
        if (this.currentDialogRef) {
          this.currentDialogRef._componentRef.instance.confirmButtonDisabled =
            this.activityForm.invalid;
        }
      }
    );

    // Handle dialog confirm action
    this.currentDialogRef.onConfirm.subscribe(() => {
      this.onSubmit();
    });
  }

  // Reset form to initial state
  resetForm(): void {
    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date();
    const todayFormatted = today.toISOString().substring(0, 10);

    this.activityForm.reset({
      nombre: '',
      descripcion: '',
      fecha_inicio: todayFormatted, // Set today as default start date
      fecha_fin: '',
      ubicacion: '',
      virtual: false,
      frecuencia: '',
      comunidad_id: null,
      url: '', // Will be validated only if virtual is true
    });
    this.isEditing = false;
    this.currentActivityId = undefined;
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.activityForm.controls).forEach((key) => {
        const control = this.activityForm.get(key);
        control?.markAsTouched();
      });

      // Construct a more specific error message
      let errorMessage = 'Please fix the following errors:';

      if (this.activityForm.get('nombre')?.invalid) {
        errorMessage +=
          '\n• Activity name is required and must be at least 3 characters';
      }

      if (this.activityForm.get('descripcion')?.invalid) {
        errorMessage += '\n• Description must be at least 10 characters';
      }

      if (this.activityForm.hasError('dateRangeInvalid')) {
        errorMessage += '\n• Start date must be before end date';
      }

      if (this.activityForm.hasError('startDatePast')) {
        errorMessage += '\n• Start date cannot be earlier than today';
      }

      if (
        this.activityForm.get('fecha_inicio')?.invalid &&
        !this.activityForm.hasError('dateRangeInvalid') &&
        !this.activityForm.hasError('startDatePast')
      ) {
        errorMessage += '\n• Start date is required';
      }

      if (
        this.activityForm.get('fecha_fin')?.invalid &&
        !this.activityForm.hasError('dateRangeInvalid')
      ) {
        errorMessage += '\n• End date is required';
      }

      if (this.activityForm.get('ubicacion')?.invalid) {
        errorMessage += '\n• Location is required';
      }

      if (this.activityForm.get('frecuencia')?.invalid) {
        errorMessage += '\n• Frequency is required';
      }

      // URL validation only if virtual is checked
      if (
        this.activityForm.get('virtual')?.value &&
        this.activityForm.get('url')?.invalid
      ) {
        errorMessage +=
          '\n• Please provide a valid URL (e.g., https://example.com or https://example.com?param=value)';
      }

      // Show error dialog but don't close the current form dialog
      this.dialogService.error(errorMessage);
      return;
    }

    const activityData = this.activityForm.value;
    this.isLoading = true;

    if (this.isEditing && this.currentActivityId) {
      this.actividadService
        .updateActividad(this.currentActivityId, activityData)
        .subscribe({
          next: () => {
            this.loadActivities();
            this.resetForm();
            this.isLoading = false;

            // Close any open dialog
            if (this.currentDialogRef) {
              this.currentDialogRef.close();
              this.currentDialogRef = null;
            }

            // Show success message
            this.dialogService.success('Activity updated successfully!');
          },
          error: (err) => {
            this.error = 'Error updating activity: ' + err.message;
            this.isLoading = false;

            // Show error message but keep the dialog open to fix issues
            this.dialogService.error('Error updating activity: ' + err.message);
          },
        });
    } else {
      this.actividadService.createActividad(activityData).subscribe({
        next: () => {
          this.loadActivities();
          this.resetForm();
          this.isLoading = false;

          // Close any open dialog
          if (this.currentDialogRef) {
            this.currentDialogRef.close();
            this.currentDialogRef = null;
          }

          // Show success message
          this.dialogService.success('Activity created successfully!');
        },
        error: (err) => {
          this.error = 'Error creating activity: ' + err.message;
          this.isLoading = false;

          // Show error message but keep the dialog open to fix issues
          this.dialogService.error('Error creating activity: ' + err.message);
        },
      });
    }
  }

  editActivity(activity: Actividad): void {
    console.log('Opening Edit Activity Dialog for:', activity);
    this.isEditing = true;
    this.currentActivityId = activity.id;

    // Format dates properly for the form
    const formattedActivity = {
      ...activity,
      fecha_inicio: this.formatDateForInput(activity.fechaInicio),
      fecha_fin: this.formatDateForInput(activity.fechaFin),
    };

    this.activityForm.patchValue(formattedActivity);

    // Mark the form as pristine to prevent validation errors on initial load
    // This ensures past dates won't trigger validation until the user changes them
    this.activityForm.markAsPristine();

    // Create a dialog reference using the activityFormTemplate
    this.currentDialogRef = this.dialogService.open({
      title: 'Edit Activity',
      content: this.activityFormTemplate,
      size: 'lg',
      confirmButtonText: 'Update',
      confirmButtonColor: 'primary',
      cancelButtonText: 'Cancel',
      showHeader: true,
      showFooter: true,
      confirmButtonDisabled: this.activityForm.invalid, // Initial state based on form validity
      data: {
        form: this.activityForm,
        isEditing: this.isEditing,
      },
    });

    // Clean up existing subscription if any
    if (this.formStatusSubscription) {
      this.formStatusSubscription.unsubscribe();
    }

    // Set up a form status subscription to update button state
    this.formStatusSubscription = this.activityForm.statusChanges.subscribe(
      (status) => {
        if (this.currentDialogRef && this.currentDialogRef._componentRef) {
          this.currentDialogRef._componentRef.instance.confirmButtonDisabled =
            this.activityForm.invalid;
        }
      }
    );

    // Handle dialog confirm action
    this.currentDialogRef.onConfirm.subscribe(() => {
      this.onSubmit();
    });
  }

  deleteActivity(id: number): void {
    // Use dialog service for confirmation
    const dialogRef = this.dialogService.delete(
      'Are you sure you want to delete this activity? This action cannot be undone.'
    );

    let isDeleting = false;
    dialogRef.onConfirm.subscribe(() => {
      if (isDeleting) return; // Prevent multiple clicks

      isDeleting = true;
      this.isLoading = true;

      this.actividadService.deleteActividad(id).subscribe({
        next: () => {
          this.loadActivities();
          this.isLoading = false;
          this.dialogService.success('Activity deleted successfully!');
        },
        error: (err) => {
          this.error = 'Error deleting activity: ' + err.message;
          this.isLoading = false;
          this.dialogService.error('Error deleting activity: ' + err.message);
        },
      });
    });
  }

  openExternalLink(url: string): void {
    if (!url) return;

    // Check if the URL has a protocol
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
    const fullUrl = hasProtocol ? url : `https://${url}`;

    window.open(fullUrl, '_blank');
  }

  // Helper method to format dates for input fields
  private formatDateForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // YYYY-MM-DD format
  }

  handleActionSelected(item: DropdownItem, activity: Actividad): void {
    if (item.id === 'edit') {
      this.editActivity(activity);
    } else if (item.id === 'delete') {
      this.deleteActivity(activity.id!);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.formStatusSubscription) {
      this.formStatusSubscription.unsubscribe();
    }
  }
}
