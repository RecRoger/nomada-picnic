import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORMS_MODULES } from '../../shared/material-modules';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MAT_FORMS_MODULES],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss'
})
export class FormControlComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;
}
