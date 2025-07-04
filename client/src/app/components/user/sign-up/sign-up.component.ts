import { Component, OnInit } from "@angular/core";
import { UIModule } from "../../shared/ui.module";
import { InputComponent } from "../../shared/primitives/input/input.component";
import {
  LucideAngularModule,
  UserPlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "lucide-angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { UsuarioService } from "../../../services/usuario.service";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [
    UIModule,
    InputComponent,
    LucideAngularModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent implements OnInit {
  iconSignUp = UserPlusIcon;
  iconNext = ArrowRightIcon;
  iconBack = ArrowLeftIcon;

  // Forms for each step
  emailForm: FormGroup;
  personalInfoForm: FormGroup;
  passwordForm: FormGroup;

  // Step management
  currentStep = 1;
  totalSteps = 3;

  // Loading states for each step
  emailLoading = false;
  personalLoading = false;
  passwordLoading = false;

  // Error states
  emailError: string = "";
  personalError: string = "";
  passwordError: string = "";

  // Submitted states
  emailSubmitted = false;
  personalSubmitted = false;
  passwordSubmitted = false;

  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  currentDateISO: string = new Date().toISOString().split("T")[0];
  defaultAvatarUrl: string =
    "https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=User";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {
    // Initialize forms for each step
    this.emailForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.personalInfoForm = this.formBuilder.group({
      nombreUsuario: ["", [Validators.required, Validators.minLength(4)]],
      genero: ["", Validators.required],
      fechaNacimiento: [null, [Validators.required, this.dateValidator]],
    });

    this.passwordForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {}

  // Easy access to form fields for each step
  get emailF() {
    return this.emailForm.controls;
  }

  get personalF() {
    return this.personalInfoForm.controls;
  }

  get passwordF() {
    return this.passwordForm.controls;
  }

  // Step navigation methods
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Step 1: Email validation
  onEmailSubmit(): void {
    this.emailSubmitted = true;
    this.emailError = "";

    if (this.emailForm.invalid) {
      return;
    }

    this.emailLoading = true;
    const email = this.emailF["email"].value;

    this.usuarioService.validateEmail(email).subscribe({
      next: (isAvailable) => {
        this.emailLoading = false;
        if (isAvailable) {
          this.nextStep();
        } else {
          this.emailError =
            "Este correo electrónico ya está registrado. Por favor, usa otro correo.";
        }
      },
      error: (error) => {
        this.emailLoading = false;
        this.emailError =
          "Error al validar el correo. Por favor, inténtalo de nuevo.";
      },
    });
  }

  // Step 2: Personal information
  onPersonalInfoSubmit(): void {
    this.personalSubmitted = true;
    this.personalError = "";

    if (this.personalInfoForm.invalid) {
      return;
    }

    // Move to password step
    this.nextStep();
  }

  // Step 3: Password and final registration
  onPasswordSubmit(): void {
    this.passwordSubmitted = true;
    this.passwordError = "";

    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordLoading = true;

    // Combine all form data
    const userData = {
      email: this.emailF["email"].value,
      nombreUsuario: this.personalF["nombreUsuario"].value,
      genero: this.personalF["genero"].value || "O",
      fechaNacimiento: this.personalF["fechaNacimiento"].value,
      password: this.passwordF["password"].value,
      fotoPerfil: this.selectedFile || undefined,
    };

    console.log("Registration data:", {
      ...userData,
      fotoPerfil: userData.fotoPerfil ? "File selected" : "No file",
      password: "[HIDDEN]",
    });

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.passwordError =
          error.message ||
          "Error en el registro. Por favor, inténtalo de nuevo.";
        this.passwordLoading = false;
      },
    });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

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

  // Handle file selection for profile image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview URL
      this.previewImageUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  // Custom validator for birth date
  dateValidator(control: AbstractControl): ValidationErrors | null {
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
}
