import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/primitives/input/input.component';
@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './activity-form.component.html',
})
export class ActivityFormComponent {
  @Input() form!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();
}
