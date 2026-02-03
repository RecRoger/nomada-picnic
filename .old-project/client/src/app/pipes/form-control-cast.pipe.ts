import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

@Pipe({
  name: 'asFormControl',
  standalone: true
})
export class FormControlCastPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): FormControl | undefined {
    return control instanceof FormControl ? control : undefined;
  }
}

@Pipe({
  name: 'asFormGroup',
  standalone: true
})
export class FormGroupCastPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): FormGroup | undefined {
    return control instanceof FormGroup ? control : undefined;
  }
}

@Pipe({
  name: 'asFormArray',
  standalone: true
})
export class FormArrayCastPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): FormArray | undefined {
    return control instanceof FormArray ? control : undefined;
  }
}