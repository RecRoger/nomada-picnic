import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BasicsFormComponent } from './components/basics-form/basics-form.component';
import { ProductionFormComponent } from '@pages/picnic-calculator/components/production-form/production-form.component';
import { AdditionalsFormComponent } from '@pages/picnic-calculator/components/additionals-form/additionals-form.component';
import { FoodFormComponent } from '@pages/picnic-calculator/components/food-form/food-form.component';
import { ClientContactFormComponent } from '@pages/picnic-calculator/components/client-contact-form/client-contact-form.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-picnic-calculator',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    BasicsFormComponent,
    ProductionFormComponent,
    AdditionalsFormComponent,
    FoodFormComponent,
    ClientContactFormComponent,
  ],
  templateUrl: './picnic-calculator.component.html',
  styleUrl: './picnic-calculator.component.scss'
})
export class PicnicCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly router: Router = inject(Router)
  private readonly route: ActivatedRoute = inject(ActivatedRoute)
  private readonly fb: FormBuilder = inject(FormBuilder)

  @ViewChild('stepper') stepper!: MatStepper;

  forms: FormGroup;

  steps = ['basics', 'production', 'additionals', 'food', 'contact'];

  selectedIndex = 0;

  stepperOrientation: Observable<StepperOrientation>;

  private readonly destroy$ = new Subject<void>();


  constructor(
  ) {
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
        boardText: [null, [Validators.required, Validators.maxLength(30)]]
      }),
      additionals: this.fb.group({
        petalsIndicator: [false],
        photoAmount: [0],
        flowersAmount: [0],
        lightsIndicators: [false],
        photographerIndicator: [false]
      }),
      food: this.fb.group({
        giftText: ["", Validators.required],
        items: this.fb.array([])
      }),
      contact: this.fb.group({
        name: ['']
      }),
    })

    const breakpointObserver = inject(BreakpointObserver);

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        takeUntil(this.destroy$),
        map(({ matches }) => (matches ? 'horizontal' : 'vertical'))
      );
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const step = params['step'];
      this.selectedIndex = this.steps.indexOf(step);
      if (this.selectedIndex === -1) {
        // Redirigir a un paso válido si la URL es incorrecta
        this.router.navigate(['/picnics', this.steps[0]]);
      }
    });
  }

  public getStepForm(step: string): FormGroup {
    return this.forms.controls[step] as FormGroup
  }

  ngAfterViewInit(): void {
    this.checkPicnicInfo()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectionChanged(selectedIndex: number) {
    this.router.navigate(['/picnics', this.steps[selectedIndex]]);
  }

  goForward(stepper: MatStepper) {
    if (this.validateStep(stepper.selectedIndex)) {
      stepper.next();
      this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
    } else {
      this.getStepForm(this.steps[stepper.selectedIndex]).markAllAsTouched()
    }
  }

  goBackward(stepper: MatStepper) {
    stepper.previous();
    this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
  }

  validateStep(index: number): boolean {
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

  private checkPicnicInfo() {
    // TODO - validar formularios y recuperar informacion previa
    if (this.selectedIndex)
      this.stepper.steps.toArray()[0].interacted = true
    // this.stepper.steps.toArray()[1].interacted = true
  }
}
