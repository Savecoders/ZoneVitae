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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize form with validation
    this.signUpForm = this.formBuilder.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        nombre_usuario: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
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

    const userData = {
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      nombre_usuario: this.f['nombre_usuario'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      rol_id: 2, // Default role for regular users
      foto_perfil: '', // Default empty profile photo
      activo: true,
    };

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
        this.error = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
