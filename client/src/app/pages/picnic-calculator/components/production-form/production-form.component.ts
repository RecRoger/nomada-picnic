import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_FORMS_MODULES } from '@shared/material-modules';

@Component({
  selector: 'app-production-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, ...MAT_FORMS_MODULES, FormControlComponent, MatSlideToggleModule],
  templateUrl: './production-form.component.html',
  styleUrl: './production-form.component.scss'
})
export class ProductionFormComponent {
  @Input() public form: FormGroup = new FormGroup({})

  public getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl
  }
}
