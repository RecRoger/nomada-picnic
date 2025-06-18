import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormArrayCastPipe, FormControlCastPipe, FormGroupCastPipe } from '@pipes/form-control-cast.pipe';
import { CostsService } from '@services/costs.service';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { Observable, of, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { COSTS_TYPES } from '@enums/cost-types.enum';
import { CostDto } from '@models/cost.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-food-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormControlComponent,
    ...MAT_FORMS_MODULES,
    FormGroupCastPipe,
    FormControlCastPipe,
    FormArrayCastPipe,
    MatCardModule
  ],
  templateUrl: './food-form.component.html',
  styleUrl: './food-form.component.scss'
})
export class FoodFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  @Input() public form?: FormGroup = new FormGroup({})

  public foodList$: Observable<CostDto[]> = of([])

  private costsService = inject(CostsService)

  private fb = inject(FormBuilder)

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.createFoodForms()
  }


  private createFoodForms() {
    this.foodList$ = this.costsService.getCostsCached(COSTS_TYPES.FOOD).pipe(
      tap(foodList => {
        const formList = (this.form?.get('items') as FormArray)
        foodList.forEach(food => {
          const foodForm = this.fb.group({
            code: [food._id],
            name: [food.name],
            selected: [false],
            amount: [0]
          })
          formList.push(foodForm)

          foodForm.get('selected')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef),)
            .subscribe(selected => {
              const quantityControl = foodForm.get('amount');
              if (selected) {
                quantityControl?.enable();
                quantityControl?.markAsUntouched();
                quantityControl?.setValidators([Validators.required, Validators.min(1)]); // Requerido si está seleccionado
              } else {
                quantityControl?.disable(); // Deshabilita si no está seleccionado
                quantityControl?.setValue(0); // Resetea la cantidad a 0
                quantityControl?.clearValidators(); // Limpia los validadores
              }
              quantityControl?.updateValueAndValidity(); // Asegura que los cambios de validación se apliquen
            });

          // Asegúrate de que la cantidad esté deshabilitada al principio si no está seleccionada
          foodForm.get('amount')?.disable();
        })
      })
    )
  }
}
