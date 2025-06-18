import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, Observable, pairwise, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BasicsFormComponent } from './components/basics-form/basics-form.component';
import { ProductionFormComponent } from '@pages/calculator-stepper/components/production-form/production-form.component';
import { AdditionalsFormComponent } from '@pages/calculator-stepper/components/additionals-form/additionals-form.component';
import { FoodFormComponent } from '@pages/calculator-stepper/components/food-form/food-form.component';
import { ClientContactFormComponent } from '@pages/calculator-stepper/components/client-contact-form/client-contact-form.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '@services/notification.service';
import { PriceBarComponent } from '@components/price-bar/price-bar.component';
import { PriceService } from '@services/price.service';
import { FormGroupCastPipe } from '@pipes/form-control-cast.pipe';
import { BudgetData } from '@models/budget.dto';

@Component({
  selector: 'app-calculator-stepper',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    FormGroupCastPipe,
    BasicsFormComponent,
    ProductionFormComponent,
    AdditionalsFormComponent,
    FoodFormComponent,
    ClientContactFormComponent,
    PriceBarComponent,
  ],
  templateUrl: './calculator-stepper.component.html',
  styleUrl: './calculator-stepper.component.scss'
})
export class PicnicCalculatorComponent implements OnInit {
  private readonly router: Router = inject(Router)
  private readonly route: ActivatedRoute = inject(ActivatedRoute)
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly notification: NotificationService = inject(NotificationService)
  private readonly priceService: PriceService = inject(PriceService)

  @ViewChild('stepper') stepper!: MatStepper;

  forms: FormGroup = this.fb.group({});

  steps = ['basics', 'production', 'additionals', 'food', 'contact'];

  selectedIndex = 0;

  stepperOrientation: Observable<StepperOrientation>;

  private readonly destroyRef = inject(DestroyRef)


  constructor(
  ) {
    this.stepperOrientation = inject(BreakpointObserver)
      .observe('(min-width: 800px)')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(({ matches }) => (matches ? 'horizontal' : 'vertical'))
      );
  }

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef),).subscribe(params => {
      const step = params['step'];
      this.selectedIndex = this.steps.indexOf(step);
      if (this.selectedIndex === -1) {
        // Redirigir a un paso válido si la URL es incorrecta
        this.router.navigate(['/picnics', this.steps[0]]);
      }
    });

    this.generateForms()
  }

  public getStepForm(step: string): FormGroup {
    return this.forms.controls[step] as FormGroup
  }

  public selectionChanged(selectedIndex: number): void {
    this.router.navigate(['/picnics', this.steps[selectedIndex]]);
  }

  public goForward(stepper: MatStepper): void {
    if (this.validateStep(stepper.selectedIndex)) {
      stepper.next();
      this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
    } else {
      this.getStepForm(this.steps[stepper.selectedIndex]).markAllAsTouched()
    }
  }

  public goBackward(stepper: MatStepper): void {
    stepper.previous();
    this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
  }

  public finalizeStepper(stepper: MatStepper): void {
    if (this.validateStep(stepper.selectedIndex)) {
      this.notification.openNotification({ message: 'Supongamos que todo salio bien' })
    } else {
      this.getStepForm(this.steps[stepper.selectedIndex]).markAllAsTouched()
    }
  }

  private generateForms(): void {
    this.forms = this.fb.group({
      basics: this.fb.group({
        event: ["", Validators.required],
        date: ["", Validators.required],
        place: ["", Validators.required],
        guestsAmount: [2, Validators.required],
      }),
      production: this.fb.group({
        tableAmount: [1, Validators.required],
        archIndicator: [true],
        bigTableIndicator: [false],
        boardText: ["", [Validators.required, Validators.maxLength(30)]],
        promoIndicator: [false],
      }),
      additionals: this.fb.group({
        items: this.fb.array([])
      }),
      food: this.fb.group({
        giftText: ["", Validators.required],
        items: this.fb.array([])
      }),
      contact: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
      }),
    })

    this.forms.valueChanges.pipe(
      startWith(this.forms.value), // Emite el valor inicial
      pairwise(), // Emite un array [previousValue, currentValue]
      debounceTime(100), // Opcional: Espera un poco para agrupar cambios rápidos
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((values: BudgetData[]) => {
      this.priceService.checkPrice(values)
    })
  }

  private validateStep(index: number): boolean {
    switch (index) {
      case 0:
        if (this.getStepForm('production')!.get('tableAmount')!.untouched) {
          const guests = Math.max(0, this.getStepForm('basics').get('guestsAmount')!.value);
          // Calcular el número de mesas (un invitado por lado libre de cada mesa unida)
          this.getStepForm('production').patchValue({
            tableAmount: Math.ceil(guests <= 4 ? 1 : (guests - 2) / 2)
          })
        }
        break
    }

    return this.getStepForm(this.steps[index]).valid
  }
}
