import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  styleUrl: './place-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public place: PlaceDto | null = null

  @Output() submit: EventEmitter<PlaceDto> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  private fb: FormBuilder = inject(FormBuilder)

  public placeForm: FormGroup = this.fb.group({})

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      name: [this.place?.name || '', Validators.required],
      description: [this.place?.description || '', Validators.required],
      images: [null],
      location: this.fb.group({
        lat: [this.place?.location?.lat || null, Validators.required],
        lng: [this.place?.location?.lng || null, Validators.required],
      }),
      mapsLink: [this.place?.mapsLink || '', Validators.required],
      zone: [this.place?.zone ?? '', Validators.required],
      transportationCost: [this.place?.transportationCost || null, [Validators.required, Validators.min(0)]],
    });
  }

  public getControl(controlName: string): FormControl {
    return this.placeForm.get(controlName) as FormControl
  }

  public getLocationControl(controlName: string): FormControl {
    return (this.placeForm.get('location') as FormGroup).get(controlName) as FormControl
  }

  onCancel() {
    this.cancel.emit()
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
