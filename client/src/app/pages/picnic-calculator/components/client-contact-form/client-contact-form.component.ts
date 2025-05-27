import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-client-contact-form',
  standalone: true,
  imports: [],
  templateUrl: './client-contact-form.component.html',
  styleUrl: './client-contact-form.component.scss'
})
export class ClientContactFormComponent {
  @Input() public form: FormGroup = new FormGroup({})

  public getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl
  }
}
