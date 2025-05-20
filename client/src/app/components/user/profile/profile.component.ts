import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { InputComponent } from '../../shared/primitives/input/input.component';
import { AvatarComponent } from '../../shared/primitives/avatar/avatar.component';
import { ButtonComponent } from '../../shared/primitives/button/button.component';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../../models/auth.model';
import {
  LucideAngularModule,
  SaveIcon,
  UserIcon,
  CameraIcon,
  LockIcon,
  CalendarIcon,
} from 'lucide-angular';
import { Usuario, UsuarioGenero } from 'app/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LayoutComponent,
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    AvatarComponent,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: Usuario | null = null;
  loading = false;
  submitted = false;
  success = false;
  error = '';
  isBrowser: boolean;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  uploadingImage = false;
  currentDateISO: string = new Date().toISOString().split('T')[0]; // Today's date in ISO format for the date input max attribute

  // Password form states
  passwordLoading = false;
  passwordSubmitted = false;
  passwordSuccess = false;
  passwordError = '';
  passwordsNotMatching = false;

  // Icons for buttons
  saveIcon = SaveIcon;
  userIcon = UserIcon;
  cameraIcon = CameraIcon;
  lockIcon = LockIcon;
  calendarIcon = CalendarIcon;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cloudinaryService: CloudinaryService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize profile form with fields that match the Usuario model
    this.profileForm = this.formBuilder.group({
      nombre_usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: [''],
      fecha_nacimiento: [null, ProfileComponent.dateValidator],
      foto_perfil: [''],
    });

    // Initialize password form
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get current user from auth service
    this.authService.currentUser$.subscribe((userData: AuthResponse | null) => {
      if (!userData) {
        this.router.navigate(['/auth/login']);
        return;
      }

      // Save basic user info from auth
      this.user = {
        ...userData.user,
        genero: userData.user.genero as UsuarioGenero,
      };

      // Fetch complete user data from the backend using the ID
      if (this.user.id) {
        this.loading = true;
        this.usuarioService.getById(this.user.id).subscribe({
          next: (fullUserData) => {
            this.loading = false;
            // Update our local user object with complete data
            this.user = {
              ...this.user,
              ...fullUserData,
              genero: fullUserData.genero as UsuarioGenero,
            };

            // Format date if it exists
            let formattedDate = null;
            if (this.user?.fecha_nacimiento) {
              // Convert to YYYY-MM-DD format for the date input
              const date = new Date(this.user.fecha_nacimiento);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toISOString().split('T')[0];
              }
            }

            // Patch form with complete user data
            this.profileForm.patchValue({
              nombre_usuario: this.user?.nombre_usuario,
              email: this.user?.email,
              genero: this.user?.genero || '',
              fecha_nacimiento: formattedDate,
              foto_perfil: this.user?.foto_perfil || '',
            });
          },
          error: (err) => {
            this.loading = false;
            this.error =
              'Failed to load user profile. Please refresh the page.';
            console.error('Error loading user profile:', err);
          },
        });
      } else {
        // If no user ID, just use the auth data
        // Format date if it exists
        let formattedDate = null;
        if (this.user?.fecha_nacimiento) {
          // Convert to YYYY-MM-DD format for the date input
          const date = new Date(this.user.fecha_nacimiento);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }

        // Patch form with current user data
        this.profileForm.patchValue({
          nombre_usuario: this.user?.nombre_usuario,
          email: this.user?.email,
          genero: this.user?.genero || '',
          fecha_nacimiento: formattedDate,
          foto_perfil: this.user?.foto_perfil || '',
        });
      }
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.success = false;
    this.error = '';

    if (this.profileForm.invalid) {
      return;
    }

    if (!this.user?.id) {
      this.error = 'User information not available. Please log in again.';
      return;
    }

    this.loading = true;

    // Upload image first if there's a selected file
    this.uploadImage().then((imageUrl) => {
      // Make sure fecha_nacimiento is in proper format if it exists
      let fechaNacimiento = this.f['fecha_nacimiento'].value;
      if (fechaNacimiento) {
        // Ensure it's a string in ISO format for the API
        const date = new Date(fechaNacimiento);
        if (!isNaN(date.getTime())) {
          fechaNacimiento = date.toISOString();
        }
      }

      // Only include the properties that are in the Usuario model
      const updateData = {
        id: this.user!.id,
        nombre_usuario: this.f['nombre_usuario'].value,
        email: this.f['email'].value,
        genero: this.f['genero'].value || null,
        fecha_nacimiento: fechaNacimiento || null,
        foto_perfil: imageUrl || this.user?.foto_perfil || null,
      };

      this.usuarioService.update(this.user!.id!, updateData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;

          // Update the local user data
          this.authService.updateUserData(response);

          // Update our local user object
          this.user = {
            ...this.user,
            ...updateData,
          };
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err.message || 'Failed to update profile. Please try again.';
        },
      });
    });
  }

  // Handle password update submission
  onPasswordSubmit(): void {
    this.passwordSubmitted = true;
    this.passwordSuccess = false;
    this.passwordError = '';
    this.passwordsNotMatching = false;

    // Check if passwords match
    if (this.p['newPassword'].value !== this.p['confirmPassword'].value) {
      this.passwordsNotMatching = true;
      return;
    }

    if (this.passwordForm.invalid) {
      return;
    }

    if (!this.user?.id) {
      this.passwordError =
        'User information not available. Please log in again.';
      return;
    }

    this.passwordLoading = true;

    // In a real app, we would send the current password for verification
    // Only include id and password properties from the Usuario model
    const passwordData = {
      id: this.user.id,
      password: this.p['newPassword'].value,
    };

    this.usuarioService.update(this.user.id!, passwordData).subscribe({
      next: (response) => {
        this.passwordLoading = false;
        this.passwordSuccess = true;
        this.passwordForm.reset();
        this.passwordSubmitted = false;

        // Consider whether you want to update the local user data
        // this.authService.updateUserData(response);
      },
      error: (err) => {
        this.passwordLoading = false;
        this.passwordError =
          err.message || 'Failed to update password. Please try again.';
      },
    });
  }

  // Custom static validator for birth date
  static dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Allow empty value if not required
    }

    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const minDate = new Date('1900-01-01');

    // Check if date is less than 1900
    if (selectedDate < minDate) {
      return { minDate: { value: control.value } };
    }

    // Check if date is greater than current date
    if (selectedDate > currentDate) {
      return { maxDate: { value: control.value } };
    }

    return null;
  }

  // Format date to display to user
  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';

    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  }

  // Handle file selection for profile image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview URL
      this.previewImageUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  // Upload the selected image to Cloudinary
  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(''); // No image selected, return empty string
        return;
      }

      this.uploadingImage = true;

      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl: string) => {
          this.uploadingImage = false;
          resolve(imageUrl);
        },
        error: (err) => {
          this.uploadingImage = false;
          this.error =
            'Failed to upload profile picture. Profile will be updated without a new profile picture.';
          console.error('Image upload error:', err);
          resolve(''); // Continue without image
        },
      });
    });
  }

  // Profile image upload implementation
  uploadProfileImage(): void {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Add an event listener to handle file selection
    fileInput.addEventListener('change', (event) => this.onFileSelected(event));

    // Trigger the file input click
    fileInput.click();
  }
}
