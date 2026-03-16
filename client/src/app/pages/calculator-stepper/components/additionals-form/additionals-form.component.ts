import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { TranslateModule } from '@ngx-translate/core';
import { FormArrayCastPipe, FormControlCastPipe, FormGroupCastPipe } from '@pipes/form-control-cast.pipe';
import { CostsService } from '@services/costs.service';
import { CostsTypes } from '@shared/enums';
import { Observable, of, tap } from 'rxjs';

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
export class AdditionalsFormComponent {
  @Input() public form?: FormGroup = new FormGroup({})

  public additionalsList$: Observable<any> = of([])

  private costsService = inject(CostsService)

  private fb = inject(FormBuilder)

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.createAdditionalsForms()
  }

  private createAdditionalsForms() {
    this.additionalsList$ = this.costsService.getCostsCached(CostsTypes.ADDITIONAL).pipe(
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

          additionalForm.get('selected')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef),)
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
