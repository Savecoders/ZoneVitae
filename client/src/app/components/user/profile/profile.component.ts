import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cloudinaryService: CloudinaryService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize profile form
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nombre_usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: [''],
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
    // Get current user
    this.authService.currentUser$.subscribe((userData: AuthResponse | null) => {
      if (!userData) {
        this.router.navigate(['/auth/login']);
        return;
      }

      // Convert the user data to match the Usuario type
      this.user = {
        ...userData.user,
        genero: userData.user.genero as UsuarioGenero,
      };

      // Patch form with current user data
      this.profileForm.patchValue({
        nombre_usuario: this.user?.nombre_usuario,
        email: this.user?.email,
        genero: this.user?.genero || '',
        foto_perfil: this.user?.foto_perfil || '',
      });
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

    const updateData = {
      ...this.profileForm.value,
      id: this.user.id,
    };

    this.usuarioService.update(this.user.id, updateData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;

        // Update the local user data
        this.authService.updateUserData(response);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err.message || 'Failed to update profile. Please try again.';
      },
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
    const passwordData = {
      id: this.user.id,
      password: this.p['newPassword'].value,
    };

    this.usuarioService.update(this.user.id, passwordData).subscribe({
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

  // Placeholder for profile image upload
  uploadProfileImage(): void {
    // In a real implementation, this would open a file picker
    // and upload the image to a server/cloud storage
    console.log('Upload profile image functionality would go here');
    alert('Image upload feature will be implemented in a future update');
  }
}
