import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { COSTS_TYPES } from '@enums/cost-types.enum';
import { TranslateModule } from '@ngx-translate/core';
import { FormArrayCastPipe, FormControlCastPipe, FormGroupCastPipe } from '@pipes/form-control-cast.pipe';
import { CostsService } from '@services/costs.service';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-additionals-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormControlComponent,
    ...MAT_FORMS_MODULES,
    MatCardModule,
    FormControlCastPipe,
    FormGroupCastPipe,
    FormArrayCastPipe,
  ],
  templateUrl: './additionals-form.component.html',
  styleUrl: './additionals-form.component.scss'
})
export class AdditionalsFormComponent implements OnDestroy {
  @Input() public form?: FormGroup = new FormGroup({})

  public additionalsList$: Observable<any> = of([])

  private costsService = inject(CostsService)

  private fb = inject(FormBuilder)

  private destroy$: Subject<void> = new Subject()

  ngOnInit(): void {
    this.createAdditionalsForms()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private createAdditionalsForms() {
    this.additionalsList$ = this.costsService.getCostsCached(COSTS_TYPES.ADDITIONAL).pipe(
      tap(additionalsList => {
        const additionalList = (this.form?.get('items') as FormArray)
        additionalsList.forEach(additional => {
          const additionalForm = this.fb.group({
            code: [additional._id],
            name: [additional.name],
            selected: [false],
            amount: [0]
          })
          additionalList.push(additionalForm)

          additionalForm.get('selected')?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(selected => {
              const quantityControl = additionalForm.get('amount');
              if (selected) {
                quantityControl?.enable();
                quantityControl?.markAsUntouched();
                quantityControl?.setValidators(additional.multipleAllowed ? [Validators.required, Validators.min(1)] : []); // Requerido si está seleccionado
              } else {
                quantityControl?.disable(); // Deshabilita si no está seleccionado
                quantityControl?.setValue(0); // Resetea la cantidad a 0
                quantityControl?.clearValidators(); // Limpia los validadores
              }
              quantityControl?.updateValueAndValidity(); // Asegura que los cambios de validación se apliquen
            });

          // Asegúrate de que la cantidad esté deshabilitada al principio si no está seleccionada
          additionalForm.get('amount')?.disable();
        })
      })
    )
  }
}
