import { Component, OnInit } from '@angular/core';
import { UIModule } from '../../shared/ui.module';
import { InputComponent } from '../../shared/primitives/input/input.component';
import { LucideAngularModule, UserPlusIcon } from 'lucide-angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    UIModule,
    InputComponent,
    LucideAngularModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  iconSignUp = UserPlusIcon;
  signUpForm: FormGroup;
  loading = false;
  submitted = false;
  error: string = '';
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  uploadingImage = false;
  currentDateISO: string = new Date().toISOString().split('T')[0]; // Today's date in ISO format for the date input max attribute
  defaultAvatarUrl: string = 'assets/images/default-avatar.png'; // Default avatar image

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cloudinaryService: CloudinaryService
  ) {
    // Initialize form with validation
    this.signUpForm = this.formBuilder.group(
      {
        nombre_usuario: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        genero: ['', Validators.required],
        fecha_nacimiento: [null, [Validators.required, this.dateValidator]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {}

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Easy access to form fields
  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    this.loading = true;

    // First upload image if selected
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

      const userData = {
        nombre_usuario: this.f['nombre_usuario'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        genero: this.f['genero'].value || null,
        fecha_nacimiento: fechaNacimiento || null,
        rol_id: 2, // Default role for regular users
        foto_perfil: imageUrl || '', // Use uploaded image URL or empty string
        estado_cuenta: 'Activo',
      };

      console.log('Registering user with data:', userData);

      this.authService.register(userData).subscribe({
        next: () => {
          // After successful registration, log in the user
          this.authService
            .login({
              email: this.f['email'].value,
              password: this.f['password'].value,
            })
            .subscribe({
              next: () => {
                this.router.navigate(['/']);
              },
              error: (error) => {
                this.error =
                  'Registration successful, but failed to log in automatically. Please log in manually.';
                this.router.navigate(['/auth/login']);
                this.loading = false;
              },
            });
        },
        error: (error) => {
          this.error =
            error.message || 'Registration failed. Please try again.';
          this.loading = false;
        },
      });
    });
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
            'Failed to upload profile picture. Registration will continue without a profile picture.';
          console.error('Image upload error:', err);
          resolve(''); // Continue without image
        },
      });
    });
  }

  // Custom validator for birth date
  dateValidator(control: AbstractControl): ValidationErrors | null {
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
}
