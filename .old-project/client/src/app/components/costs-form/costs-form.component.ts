import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { CostDto } from '@models/cost.dto';
import { COSTS_TYPES } from '@enums/cost-types.enum';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-costs-form',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, FormsModule, ...MAT_FORMS_MODULES, MatSlideToggleModule, FormControlComponent],
  templateUrl: './costs-form.component.html',
  styleUrl: './costs-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostsFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public cost?: CostDto

  @Output() submit: EventEmitter<CostDto> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  public readonly COSTS_TYPES = COSTS_TYPES

  public readonly COSTS_TYPES_OPTIONS = Object.entries(COSTS_TYPES)
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
      type: [this.cost?.type || COSTS_TYPES.PRODUCTION, Validators.required],
      images: [null],
      guestsCoverage: [this.cost?.guestsCoverage || 0, [Validators.min(0)]],
      providerCost: [this.cost?.providerCost || 0, [Validators.required, Validators.min(0)]],
      productionCost: [this.cost?.productionCost || 0, [Validators.required, Validators.min(0)]],
      earnPercentage: [this.cost?.earnPercentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      multipleAllowed: [this.cost?.multipleAllowed || false, []],
      deliveryRequired: [this.cost?.deliveryRequired || false, []],
    });
    this.calculateCostsNPrice()
    this.checkPrices()
  }

  public getControl(controlName: string): FormControl {
    return this.costForm.get(controlName) as FormControl
  }

  onCancel() {
    this.cancel.emit()
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
