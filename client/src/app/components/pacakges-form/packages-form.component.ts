import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { ICost, IPicnicPackage } from '@shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CostsService } from '@services/costs.service';
import { CostsTypes } from '@shared/enums';

@Component({
  selector: 'app-packages-form',
  standalone: true,
  imports: [TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    ...MAT_FORMS_MODULES,
    MatSlideToggleModule,
    MatIconModule,
    FormControlComponent,
  ],
  templateUrl: './packages-form.component.html',
  styleUrl: './packages-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public package?: IPicnicPackage

  @Output() submit: EventEmitter<IPicnicPackage> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  private fb: FormBuilder = inject(FormBuilder)

  public packageForm: FormGroup = this.fb.group({})

  public productionCosts: ICost[] = []

  private readonly costService = inject(CostsService)

  ngOnInit(): void {
    this.packageForm = this.fb.group({
      name: [this.package?.name || '', Validators.required],
      description: [this.package?.description || '', Validators.required],
      detail: [this.package?.detail || ''],
      tag: [this.package?.tag || ''],
      minGuests: [this.package?.minGuests || 2],
      maxGuests: [this.package?.maxGuests || 30, Validators.required],
      image: [null],
      extraTransport: [this.package?.extraTransport || 30],
      includedItems: this.fb.array(this.package?.includedItems || []),
      expensesPercent: [this.package?.expensesPercent || 40, [Validators.required, Validators.min(0)]],
      bigExpensesPercent: [this.package?.bigExpensesPercent || 0, [Validators.required, Validators.min(0)]],
      profitPercent: [this.package?.profitPercent || 15, [Validators.min(0)]],
      productionCostIds: [[], [Validators.required]],
    });
    this.getProductionCosts()
  }

  public getControl(controlName: string): FormControl {
    return this.packageForm.get(controlName) as FormControl
  }

  get includedItems(): FormArray {
    return this.packageForm.get('includedItems') as FormArray;
  }

  public addIncludedItem(value: string = ''): void {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      this.includedItems.push(this.fb.control(trimmedValue, Validators.required));
    }
  }

  public removeIncludedItem(index: number): void {
    this.includedItems.removeAt(index);
  }

  public onCancel() {
    this.cancel.emit()
  }

  public onSubmit() {
    if (this.packageForm.valid) {
      this.submit.emit(this.packageForm.value)
    }
  }

  private getProductionCosts(): void {
    this.costService.getCostsCached(CostsTypes.PRODUCTION).subscribe(costs => {
      this.productionCosts = costs.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
      if (this.package?.productionCostIds?.length) {
        this.packageForm.get('productionCostIds')?.setValue(
          this.productionCosts.filter(cost => this.package?.productionCostIds?.includes(cost.name))
            .map(cost => cost._id)
        )
      }
    })
  }
}
