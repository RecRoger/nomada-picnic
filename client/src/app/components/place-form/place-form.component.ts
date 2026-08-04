import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { IPlace } from '@shared/interfaces';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-place-form',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    ...MAT_FORMS_MODULES,
    MatChipsModule,
    MatIconModule,
    FormControlComponent],
  templateUrl: './place-form.component.html',
  styleUrl: './place-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public place: IPlace | null = null

  @Output() submit: EventEmitter<IPlace> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  private fb: FormBuilder = inject(FormBuilder)

  public placeForm: FormGroup = this.fb.group({})

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      name: [this.place?.name || '', Validators.required],
      address: [this.place?.address || '', Validators.required],
      description: [this.place?.description || '', Validators.required],
      detail: [this.place?.detail || ''],
      images: [null],
      tags: this.fb.array(this.place?.tags || []),
      location: this.fb.group({
        lat: [this.place?.location?.lat || null, Validators.required],
        lng: [this.place?.location?.lng || null, Validators.required],
      }),
      mapsLink: [this.place?.mapsLink || '', Validators.required],
      zone: [this.place?.zone ?? '', [Validators.required, Validators.min(0)]],
      transportationCost: [this.place?.transportationCost || null, [Validators.required, Validators.min(0)]],
    });
  }

  public getControl(controlName: string): FormControl {
    return this.placeForm.get(controlName) as FormControl
  }

  public get tagsFormArray(): FormArray {
    return this.placeForm.get('tags') as FormArray;
  }

  public getLocationControl(controlName: string): FormControl {
    return (this.placeForm.get('location') as FormGroup).get(controlName) as FormControl
  }

  public onCancel(): void {
    this.cancel.emit()
  }

  onTagInputEvent(event: MatChipInputEvent | FocusEvent | Event): void {
    let value = '';
    let inputElement: HTMLInputElement | null = null;
    if ('chipInput' in event) {
      value = event.value;
      inputElement = event.chipInput.inputElement;
    }
    else if (event.target) {
      inputElement = event.target as HTMLInputElement;
      value = inputElement.value;
    }
    const trimmedValue = (value || '').trim();
    if (trimmedValue && !this.tagsFormArray.value.includes(trimmedValue)) {
      this.tagsFormArray.push(this.fb.control(trimmedValue));
    }
    if (inputElement) {
      inputElement.value = '';
    }
  }

  public removeTag(index: number): void {
    this.tagsFormArray.removeAt(index);
  }

  public onSubmit() {
    if (this.placeForm.valid) {
      this.submit.emit(this.placeForm.value)
    }
  }

  public onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.placeForm.patchValue({
        images: fileList
      })
    }
  }
}
