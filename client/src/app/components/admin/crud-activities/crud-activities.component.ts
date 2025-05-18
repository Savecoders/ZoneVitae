import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
import { DialogRef, DialogService } from '../../../services/dialog.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { BadgeComponent } from '../../shared/primitives/badge/badge.component';
import {
  DropdownMenuComponent,
  DropdownItem,
} from '../../shared/primitives/dropdown-menu/dropdown-menu.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivityModalComponent } from './activity-modal/activity-modal.component';

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
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BadgeComponent,
    DropdownMenuComponent,
    LucideAngularModule,
    ActivityFormComponent,
    ActivityModalComponent,
  ],
  templateUrl: './crud-activities.component.html',
  styleUrl: './crud-activities.component.css',
})
export class CrudActivitiesComponent implements OnInit {
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

  // Activity modal properties
  showModal = false;
  isSubmitting = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('activityFormTemplate') activityFormTemplate!: TemplateRef<any>;

  // Properties to track current dialog
  private currentDialogRef: DialogRef | null = null;

  constructor(
    private actividadService: ActividadService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.activityForm = this.fb.group({
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

  ngOnInit(): void {
    this.loadActivities();
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
    this.resetForm();
    this.isEditing = false;
    this.showModal = true;
  }

  // Modal save handler
  onModalSave(formData: any) {
    // Use form data directly from the modal
    this.isSubmitting = true;

    if (this.isEditing && this.currentActivityId) {
      this.actividadService
        .updateActividad(this.currentActivityId, formData)
        .subscribe({
          next: () => {
            this.loadActivities();
            this.resetForm();
            this.isSubmitting = false;
            this.showModal = false;
            this.dialogService.success('Activity updated successfully!');
          },
          error: (err) => {
            this.error = 'Error updating activity: ' + err.message;
            this.isSubmitting = false;
            this.dialogService.error('Error updating activity: ' + err.message);
          },
        });
    } else {
      this.actividadService.createActividad(formData).subscribe({
        next: () => {
          this.loadActivities();
          this.resetForm();
          this.isSubmitting = false;
          this.showModal = false;
          this.dialogService.success('Activity created successfully!');
        },
        error: (err) => {
          this.error = 'Error creating activity: ' + err.message;
          this.isSubmitting = false;
          this.dialogService.error('Error creating activity: ' + err.message);
        },
      });
    }
  }

  // Modal cancel handler
  onModalCancel() {
    this.showModal = false;
    this.resetForm();
  }

  // Reset form to initial state
  resetForm(): void {
    this.activityForm.reset({
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

      // Show error dialog but don't close the current form dialog
      this.dialogService.error(
        'Please fix the errors in the form before submitting.'
      );
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
            this.showModal = false;

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
          this.showModal = false;

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
    this.isEditing = true;
    this.currentActivityId = activity.id;

    // Format dates properly for the form
    const formattedActivity = {
      ...activity,
      fecha_inicio: this.formatDateForInput(activity.fecha_inicio),
      fecha_fin: this.formatDateForInput(activity.fecha_fin),
    };

    this.activityForm.patchValue(formattedActivity);

    // Show the edit modal
    this.showModal = true;
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

  // Filter activities based on search term
  get filteredActivities(): Actividad[] {
    return this.activities.filter(
      (activity) =>
        activity.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        activity.descripcion
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        activity.ubicacion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleActionSelected(item: DropdownItem, activity: Actividad): void {
    if (item.id === 'edit') {
      this.editActivity(activity);
    } else if (item.id === 'delete') {
      this.deleteActivity(activity.id!);
    }
  }
}
