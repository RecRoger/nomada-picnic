import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlCastPipe } from '@pipes/form-control-cast.pipe';
import { MAT_FORMS_MODULES } from '@shared/material-modules';

@Component({
  selector: 'app-production-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ...MAT_FORMS_MODULES,
    FormControlComponent,
    FormControlCastPipe
  ],
  templateUrl: './production-form.component.html',
  styleUrl: './production-form.component.scss'
})
export class ProductionFormComponent {
  @Input() public form?: FormGroup = new FormGroup({})
}
