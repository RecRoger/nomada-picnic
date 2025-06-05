import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormArrayCastPipe, FormControlCastPipe } from '@pipes/form-control-cast.pipe';
import { CostsService } from '@services/costs.service';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-food-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormControlComponent,
    ...MAT_FORMS_MODULES,
    FormControlCastPipe,
    FormArrayCastPipe,
  ],
  templateUrl: './food-form.component.html',
  styleUrl: './food-form.component.scss'
})
export class FoodFormComponent implements OnInit, OnDestroy {
  @Input() public form: FormGroup = new FormGroup({})

  public foodList$: Observable<any> = of([])

  private costsService = inject(CostsService)

  private fb = inject(FormBuilder)

  private destroy$: Subject<void> = new Subject()

  ngOnInit(): void {
    this.createFoodForms()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public getFoodForm(index: number): FormGroup {
    return (this.form.get('items') as FormArray).controls[index] as FormGroup
  }

  public getQuantityControl(index: number): FormControl {
    return this.getFoodForm(index).get('quantity') as FormControl
  }

  private createFoodForms() {
    this.foodList$ = this.costsService.getCosts('food').pipe(
      tap(foodList => {
        const formList = (this.form.get('items') as FormArray)
        foodList.forEach(_ => {
          const foodForm = this.fb.group({
            selected: [false],
            quantity: [0]
          })
          formList.push(foodForm)

          foodForm.get('selected')?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(selected => {
              const quantityControl = foodForm.get('quantity');
              if (selected) {
                quantityControl?.enable();
                quantityControl?.setValidators([Validators.required, Validators.min(1)]); // Requerido si está seleccionado
              } else {
                quantityControl?.disable(); // Deshabilita si no está seleccionado
                quantityControl?.setValue(0); // Resetea la cantidad a 0
                quantityControl?.clearValidators(); // Limpia los validadores
              }
              quantityControl?.updateValueAndValidity(); // Asegura que los cambios de validación se apliquen
            });

          // Asegúrate de que la cantidad esté deshabilitada al principio si no está seleccionada
          foodForm.get('quantity')?.disable();
        })
      })
    )
  }
}
