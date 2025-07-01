import { Component, OnInit } from "@angular/core";
import { UIModule } from "../../shared/ui.module";
import { InputComponent } from "../../shared/primitives/input/input.component";
import { LucideAngularModule, UserPlusIcon } from "lucide-angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
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
  signUpForm: FormGroup;
  loading = false;
  submitted = false;
  error: string = "";
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  currentDateISO: string = new Date().toISOString().split("T")[0]; // Today's date in ISO format for the date input max attribute
  defaultAvatarUrl: string = "assets/images/default-avatar.png"; // Default avatar image

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    // Initialize form with validation
    this.signUpForm = this.formBuilder.group(
      {
        nombreUsuario: ["", [Validators.required, Validators.minLength(4)]],
        email: ["", [Validators.required, Validators.email]],
        genero: ["", Validators.required],
        fechaNacimiento: [null, [Validators.required, this.dateValidator]],
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

    // Only allow 'M', 'F', or 'O' for genero
    let generoValue = this.f["genero"].value;
    if (!["M", "F", "O"].includes(generoValue)) {
      generoValue = "O"; // Default to 'O' (Other) if not selected
    }
    const userData = {
      nombreUsuario: this.f["nombreUsuario"].value,
      email: this.f["email"].value,
      password: this.f["password"].value,
      genero: generoValue,
      fechaNacimiento: this.f["fechaNacimiento"].value,
      fotoPerfil: this.selectedFile === null ? undefined : this.selectedFile,
    };

    console.log("Registering user with data:", userData);

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.error = error.message || "Registration failed. Please try again.";
        this.loading = false;
      },
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
