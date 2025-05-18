import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ButtonComponent } from '../../../shared/primitives/button/button.component';
import { InputComponent } from '../../../shared/primitives/input/input.component';
import { SelectComponent } from '../../../shared/primitives/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './activity-dialog.component.html',
})
export class ActivityDialogComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() isEditing = false;
  @Input() onSave: () => void = () => {};
  @Input() onCancel: () => void = () => {};

  ngOnInit() {
    if (!this.form) {
      console.error('Form is required for ActivityDialogComponent');
    }
  }

  save() {
    if (this.onSave) {
      this.onSave();
    }
  }

  cancel() {
    if (this.onCancel) {
      this.onCancel();
    }
  }
}
