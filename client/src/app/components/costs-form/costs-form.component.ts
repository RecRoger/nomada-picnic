import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { ICost } from '@shared/interfaces';
import { CostsTypes } from '@shared/enums';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-costs-form',
  standalone: true,
  imports: [TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    ...MAT_FORMS_MODULES,
    MatSlideToggleModule,
    MatChipsModule,
    MatIconModule,
    FormControlComponent,
  ],
  templateUrl: './costs-form.component.html',
  styleUrl: './costs-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostsFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public cost?: ICost

  @Output() submit: EventEmitter<ICost> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  public readonly CostsTypes = CostsTypes

  public readonly CostsTypes_OPTIONS = Object.entries(CostsTypes)
    .filter(([key]) => isNaN(Number(key))) // Filtra las claves numéricas (inversas)
    .map(([text, value]) => ({ text: 'COSTS.TYPES_DESCRIPTION.' + text, value }));

  private fb: FormBuilder = inject(FormBuilder)

  public costForm: FormGroup = this.fb.group({})

  public totalPrice: number = 0

  public totalCost: number = 0

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.costForm = this.fb.group({
      name: [this.cost?.name || '', Validators.required],
      description: [this.cost?.description || '', Validators.required],
      detail: [this.cost?.detail || ''],
      type: [this.cost?.type || CostsTypes.PRODUCTION, Validators.required],
      images: [null],
      tags: this.fb.array(this.cost?.tags || []),
      guestsCoverage: [this.cost?.guestsCoverage || 0, [Validators.min(0)]],
      providerCost: [this.cost?.providerCost || 0, [Validators.required, Validators.min(0)]],
      productionCost: [this.cost?.productionCost || 0, [Validators.required, Validators.min(0)]],
      earnPercentage: [this.cost?.earnPercentage || 0, [Validators.required, Validators.min(0)]],
      multipleAllowed: [this.cost?.multipleAllowed || false, []],
      deliveryRequired: [this.cost?.deliveryRequired || false, []],
    });
    this.calculateCostsNPrice()
    this.checkPrices()
  }

  public getControl(controlName: string): FormControl {
    return this.costForm.get(controlName) as FormControl
  }
  public get tagsFormArray(): FormArray {
    return this.costForm.get('tags') as FormArray;
  }

  onCancel() {
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

  onSubmit() {
    if (this.costForm.valid) {
      this.submit.emit(this.costForm.value)
    }
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.costForm.patchValue({
        images: fileList
      })
    }
  }

  private checkPrices() {
    if (this.costForm.get('providerCost') && this.costForm.get('productionCost') && this.costForm.get('earnPercentage')) {
      merge(
        this.costForm.get('providerCost')!.valueChanges,
        this.costForm.get('productionCost')!.valueChanges,
        this.costForm.get('earnPercentage')!.valueChanges,
      )
        .pipe(takeUntilDestroyed(this.destroyRef),)
        .subscribe(() => {
          this.calculateCostsNPrice()
        })
    }
  }

  private calculateCostsNPrice() {
    this.totalCost = Number(this.costForm.get('productionCost')?.value || 0) + Number(this.costForm.get('providerCost')?.value || 0)
    const total = this.totalCost * (1 + (Number(this.costForm.get('earnPercentage')?.value || 0) / 100))
    this.totalPrice = parseFloat(total.toFixed(2))
  }
}
