import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-food-form',
  standalone: true,
  imports: [],
  templateUrl: './food-form.component.html',
  styleUrl: './food-form.component.scss'
})
export class FoodFormComponent {
  @Input() public form: FormGroup = new FormGroup({})

  public getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl
  }
}
