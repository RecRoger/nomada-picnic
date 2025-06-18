import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { Subject } from 'rxjs';
import { ExpenseDto } from '@models/expense.dto';

@Component({
  selector: 'app-expenses-form',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, FormsModule, ...MAT_FORMS_MODULES, MatSlideToggleModule, FormControlComponent],
  templateUrl: './expenses-form.component.html',
  styleUrl: './expenses-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesFormComponent implements OnInit {
  @Input() public cancelOption: boolean = true

  @Input() public expense?: ExpenseDto

  @Output() submit: EventEmitter<ExpenseDto> = new EventEmitter()

  @Output() cancel: EventEmitter<void> = new EventEmitter()

  private fb: FormBuilder = inject(FormBuilder)

  public expenseForm: FormGroup = this.fb.group({})

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      name: [this.expense?.name || '', Validators.required],
      cost: [this.expense?.cost || 0, [Validators.required, Validators.min(0)]],
      monthly: [this.expense?.monthly ?? true, []],
      amortization: [this.expense?.amortization || 0, [Validators.min(0)]],
    });
  }

  public getControl(controlName: string): FormControl {
    return this.expenseForm.get(controlName) as FormControl
  }

  onCancel() {
    this.cancel.emit()
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.submit.emit(this.expenseForm.value)
    }
  }
}
