import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { CostsService } from '@services/costs.service';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-food-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormControlComponent],
  templateUrl: './food-form.component.html',
  styleUrl: './food-form.component.scss'
})
export class FoodFormComponent implements OnInit {
  @Input() public form: FormGroup = new FormGroup({})

  public foodList$: Observable<any> = of([])

  private costsService = inject(CostsService)

  ngOnInit(): void {
    this.createFoodForms()
  }

  public getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl
  }

  private createFoodForms() {
    this.foodList$ = this.costsService.getCosts('food').pipe(
      tap(foodList => {
        foodList.forEach(food => this.form.get('items'))
      })
    )
  }
}
