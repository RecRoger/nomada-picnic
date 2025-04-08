import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORMS_MODULES } from '../../shared/material-modules';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, ...MAT_FORMS_MODULES],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss'
})
export class FormControlComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;
  @Input() hint?: string;
  @Input() options?: { value: string, text: string }[];
  @Input() prefix?: string;
  @Input() suffix?: string;

  public readonly INPUT_TYPE = ['text', 'number', 'email', 'password']

  public onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.control.patchValue(fileList)
    }
  }
}

