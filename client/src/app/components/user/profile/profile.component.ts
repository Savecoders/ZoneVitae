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
} from 'lucide-angular';

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
  user: any = null;
  loading = false;
  submitted = false;
  success = false;
  error = '';
  isBrowser: boolean;

  // Icons for buttons
  saveIcon = SaveIcon;
  userIcon = UserIcon;
  cameraIcon = CameraIcon;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cloudinaryService: CloudinaryService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nombre_usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      foto_perfil: [''],
    });
  }

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe((userData: AuthResponse | null) => {
      if (!userData) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.user = userData.user;

      // Patch form with current user data
      this.profileForm.patchValue({
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        nombre_usuario: this.user.nombre_usuario,
        email: this.user.email,
        bio: this.user.bio || '',
        foto_perfil: this.user.foto_perfil || '',
      });
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.success = false;
    this.error = '';

    if (this.profileForm.invalid) {
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

  // Placeholder for profile image upload
  uploadProfileImage(): void {
    // In a real implementation, this would open a file picker
    // and upload the image to a server/cloud storage
    console.log('Upload profile image functionality would go here');
    alert('Image upload feature will be implemented in a future update');
  }
}
