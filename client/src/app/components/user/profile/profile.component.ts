import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { LayoutComponent } from "../../shared/layout/layout.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { InputComponent } from "../../shared/primitives/input/input.component";
import { AvatarComponent } from "../../shared/primitives/avatar/avatar.component";
import { ButtonComponent } from "../../shared/primitives/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { UsuarioService } from "../../../services/usuario.service";
import { CloudinaryService } from "../../../services/cloudinary.service";
import { Router } from "@angular/router";
import { AuthResponse } from "../../../models/auth.model";
import {
  LucideAngularModule,
  SaveIcon,
  UserIcon,
  CameraIcon,
  LockIcon,
  CalendarIcon,
} from "lucide-angular";
import { Usuario, UsuarioGenero } from "app/models";
import { UIModule } from "../../shared/ui.module";
import { BadgeComponent } from "../../shared/primitives/badge/badge.component";
import { catchError, of } from "rxjs";

@Component({
  selector: "app-profile",
  imports: [
    LayoutComponent,
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    AvatarComponent,
    ButtonComponent,
    LucideAngularModule,
    BadgeComponent,
    UIModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: Usuario | null = null;
  loading = false;
  submitted = false;
  success = false;
  error = "";
  isBrowser: boolean;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  uploadingImage = false;
  currentDateISO: string = new Date().toISOString().split("T")[0]; // Today's date in ISO format for the date input max attribute

  // Password form states
  passwordLoading = false;
  passwordSubmitted = false;
  passwordSuccess = false;
  passwordError = "";
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
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize profile form with fields that match the Usuario model
    this.profileForm = this.formBuilder.group({
      nombreUsuario: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      genero: [""],
      fechaNacimiento: [null, ProfileComponent.dateValidator],
      fotoPerfil: [""],
    });

    // Initialize password form
    this.passwordForm = this.formBuilder.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // Get current user from auth service
    this.authService.currentUser$.subscribe((userData: AuthResponse | null) => {
      if (!userData) {
        this.router.navigate(["/auth/login"]);
        return;
      }
      const userInfo = userData.usuario;
      this.user = {
        ...userInfo,
        genero: userInfo.genero as UsuarioGenero,
        id: userInfo.id as string,
        nombreUsuario: userInfo.nombreUsuario ?? "",
        estadoCuenta: userInfo.estadoCuenta ?? "",
      };

      // Fetch complete user data from the backend using the ID
      if (this.user && this.user.id) {
        this.loading = true;
        this.usuarioService.getById(this.user.id).subscribe({
          next: (fullUserData) => {
            this.loading = false;
            // Update our local user object with complete data
            this.user = {
              ...this.user,
              ...fullUserData,
              genero: fullUserData.genero as UsuarioGenero,
              nombreUsuario:
                fullUserData.nombreUsuario ?? this.user?.nombreUsuario ?? "",
              estadoCuenta:
                fullUserData.estadoCuenta ?? this.user?.estadoCuenta ?? "",
            };

            // Format date if it exists
            let formattedDate = null;
            if (this.user?.fechaNacimiento) {
              // Convert to YYYY-MM-DD format for the date input
              const date = new Date(this.user.fechaNacimiento);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toISOString().split("T")[0];
              }
            }

            // Patch form with complete user data
            this.profileForm.patchValue({
              nombreUsuario: this.user?.nombreUsuario,
              email: this.user?.email,
              genero: this.user?.genero || "",
              fechaNacimiento: formattedDate,
              fotoPerfil: this.user?.fotoPerfil || "",
            });
          },
          error: (err) => {
            this.loading = false;
            this.error =
              err.message ||
              "Error al cargar el perfil de usuario. Por favor, recarga la página.";
            console.error("Error loading user profile:", err);
          },
        });
      } else {
        // If no user ID, just use the auth data
        // Format date if it exists
        let formattedDate = null;
        if (this.user?.fechaNacimiento) {
          // Convert to YYYY-MM-DD format for the date input
          const date = new Date(this.user.fechaNacimiento);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split("T")[0];
          }
        }

        // Patch form with current user data
        this.profileForm.patchValue({
          nombreUsuario: this.user?.nombreUsuario,
          email: this.user?.email,
          genero: this.user?.genero || "",
          fechaNacimiento: formattedDate,
          fotoPerfil: this.user?.fotoPerfil || "",
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
    this.error = "";

    if (this.profileForm.invalid) {
      return;
    }

    if (!this.user || !this.user.id) {
      this.error = "User information not available. Please log in again.";
      return;
    }

    this.loading = true;

    this.uploadImage().then((imageUrl) => {
      let fechaNacimiento = this.f["fechaNacimiento"].value;
      if (fechaNacimiento) {
        // Ensure it's a string in ISO format for the API
        const date = new Date(fechaNacimiento);
        if (!isNaN(date.getTime())) {
          fechaNacimiento = date.toISOString().split("T")[0];
        }
      }

      // Verify user is still defined (for TypeScript)
      if (!this.user || !this.user.id) {
        this.error =
          "Información de usuario no disponible. Por favor, inténtalo de nuevo.";
        this.loading = false;
        return;
      }

      // Create FormData for file upload if needed
      const formData = new FormData();
      formData.append("nombreUsuario", this.f["nombreUsuario"].value);
      formData.append("email", this.f["email"].value);
      formData.append("genero", this.f["genero"].value || "");

      if (fechaNacimiento) {
        formData.append("fechaNacimiento", fechaNacimiento);
      }

      if (imageUrl) {
        // If we have a new image URL from Cloudinary
        formData.append("fotoPerfilUrl", imageUrl);
      } else if (this.selectedFile) {
        // If we have a file but no URL (direct upload to API)
        formData.append("fotoPerfil", this.selectedFile);
      }

      this.usuarioService.updateProfile(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;

          // Update the local user data
          this.authService.updateUserData({
            token: response.token,
            usuario: response.usuario,
          });

          // Reset form state
          this.submitted = false;
          this.selectedFile = null;
          this.previewImageUrl = null;
        },
        error: (err) => {
          this.loading = false;
          this.success = false;
          this.error =
            err?.error?.message ||
            err?.error?.Message ||
            err?.message ||
            "Ocurrió un error inesperado al actualizar el perfil.";
        },
      });
    });
  }

  // Handle password update submission
  onPasswordSubmit(): void {
    this.passwordSubmitted = true;
    this.passwordSuccess = false;
    this.passwordError = "";
    this.passwordsNotMatching = false;

    // Check if passwords match
    if (this.p["newPassword"].value !== this.p["confirmPassword"].value) {
      this.passwordsNotMatching = true;
      return;
    }

    if (this.passwordForm.invalid) {
      return;
    }

    if (!this.user || !this.user.id) {
      this.passwordError =
        "Información de usuario no disponible. Por favor, inicia sesión de nuevo.";
      return;
    }

    this.passwordLoading = true;

    // Store the ID in a variable to satisfy TypeScript
    const userId = this.user.id;

    // Use the dedicated password change endpoint
    this.usuarioService
      .changePassword(
        userId,
        this.p["currentPassword"].value,
        this.p["newPassword"].value,
      )
      .pipe(
        catchError((err) => {
          this.passwordLoading = false;
          this.passwordError =
            err.message ||
            "Error al cambiar la contraseña. Por favor, inténtalo de nuevo.";
          return of(null);
        }),
      )
      .subscribe({
        next: (response) => {
          if (response !== null) {
            this.passwordLoading = false;
            this.passwordSuccess = true;
            this.passwordForm.reset();
            this.passwordSubmitted = false;
            this.passwordsNotMatching = false;
          }
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
    const minDate = new Date("1900-01-01");

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
    if (!date) return "";

    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "";
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

  // If using Cloudinary for image hosting, we would upload the image first
  // Otherwise, we can let the API handle the image upload directly
  uploadImage(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.selectedFile) {
        resolve(""); // No image selected, return empty string
        return;
      }

      // Option 1: Let the API handle the image upload (via FormData)
      // Just return empty string as we'll append the file to FormData later
      resolve("");

      // Option 2: Use Cloudinary for image hosting (uncomment if needed)
      /*
      this.uploadingImage = true;
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl: string) => {
          this.uploadingImage = false;
          resolve(imageUrl);
        },
        error: (err) => {
          this.uploadingImage = false;
          this.error = 'Error al subir la foto de perfil. El perfil se actualizará sin una nueva foto de perfil.';
          console.error('Image upload error:', err);
          resolve(''); // Continue without image
        },
      });
      */
    });
  }

  // Profile image upload implementation
  uploadProfileImage(): void {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    // Add an event listener to handle file selection
    fileInput.addEventListener("change", (event) => this.onFileSelected(event));

    // Trigger the file input click
    fileInput.click();
  }
}
