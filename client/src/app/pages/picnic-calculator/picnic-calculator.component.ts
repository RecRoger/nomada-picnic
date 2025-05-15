import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BasicsFormComponent } from './components/basics-form/basics-form.component';
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

  forms: FormArray;

  steps = ['basics', 'additionals', 'food', 'contact'];

  selectedIndex = 0;

  stepperOrientation: Observable<StepperOrientation>;

  private readonly destroy$ = new Subject<void>();


  constructor(
  ) {
    this.forms = this.fb.array([
      this.fb.group({
        event: ["", Validators.required],
        date: ["", Validators.required],
        place: ["", Validators.required],
        guestsNumber: [2, Validators.required],
      }),
      this.fb.group({}),
      this.fb.group({}),
      this.fb.group({}),
    ])

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

  public getStepForm(index: number): FormGroup {
    return this.forms.controls[index] as FormGroup
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
    if (this.getStepForm(stepper.selectedIndex).valid) {
      stepper.next();
      this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
    } else {
      this.getStepForm(stepper.selectedIndex).markAllAsTouched()
    }
  }

  goBackward(stepper: MatStepper) {
    stepper.previous();
    this.router.navigate(['/picnics', this.steps[stepper.selectedIndex]]);
  }

  private checkPicnicInfo() {
    // TODO - validar formularios y recuperar informacion previa
    if (this.selectedIndex)
      this.stepper.steps.toArray()[0].interacted = true
    // this.stepper.steps.toArray()[1].interacted = true
  }
}
