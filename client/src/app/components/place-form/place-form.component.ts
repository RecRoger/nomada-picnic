import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_FORMS_MODULES } from '../../shared/material-modules';
import { PlaceDto } from '../../models/place.dto';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'app-place-form',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, FormsModule, ...MAT_FORMS_MODULES, FormControlComponent],
  templateUrl: './place-form.component.html',
  styleUrl: './place-form.component.scss'
})
export class PlaceFormComponent {
  @Input() public place: PlaceDto | null = null

  @Output() submit: EventEmitter<PlaceDto> = new EventEmitter()

  placeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.placeForm = this.fb.group({
      name: [this.place?.name || '', Validators.required],
      description: [this.place?.description || '', Validators.required],
      images: [null],
      mapsLink: [this.place?.mapsLink || '', Validators.required],
      zone: [this.place?.zone || null, Validators.required],
      transportationCost: [this.place?.transportationCost || null, [Validators.required, Validators.min(0)]],
    });
  }

  public getControl(controlName: string): FormControl {
    return this.placeForm.get(controlName) as FormControl
  }

  onSubmit() {
    if (this.placeForm.valid) {
      this.submit.emit(this.placeForm.value)
    }
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.placeForm.patchValue({
        images: fileList
      })
    }
  }
}
