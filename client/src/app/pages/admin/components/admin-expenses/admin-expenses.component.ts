import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '@services/notification.service';
import { ALERT_TYPES } from '@enums/alert-types.enum';
import { ExpensesService } from '@services/expenses.service';
import { ExpenseDto, ExpenseValueDto } from '@models/expense.dto';
import { ExpensesFormComponent } from '@components/expenses-form/expenses-form.component';
import { Observable, of } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';


const MAT_MODULES = [
  MatExpansionModule, MatDividerModule, MatButtonModule, MatIconModule
]
@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ...MAT_MODULES,
    ExpensesFormComponent,
  ],
  templateUrl: './admin-expenses.component.html',
  styleUrl: './admin-expenses.component.scss',
})
export class AdminExpensesComponent implements OnInit {
  private readonly expenseService: ExpensesService = inject(ExpensesService)

  private readonly translateService: TranslateService = inject(TranslateService)

  public readonly dialog = inject(MatDialog);

  private readonly notificationService: NotificationService = inject(NotificationService)

  public expenseCosts$: Observable<ExpenseValueDto | null> = of(null)

  public expensesList: ExpenseDto[] = [];

  public showForm?: boolean

  public expenseToEdit?: ExpenseDto

  ngOnInit(): void {
    this.getExpenses()
  }

  public getExpenses(): void {
    this.expenseService.getExpenses()
      .subscribe(list => {
        this.expensesList = list
      })

    this.expenseCosts$ = this.expenseService.getExpensesValues()
  }

  public saveExpense(formData: ExpenseDto) {
    const request = (this.expenseToEdit)
      ? this.expenseService.editExpense(this.expenseToEdit._id || '', formData)
      : this.expenseService.createExpense(formData)

    request.subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: this.expenseToEdit ? 'EXPENSES.EDITED' : 'EXPENSES.ADDED' })
        this.getExpenses()
        this.toggleEditForm()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, ALERT_TYPES.ERROR)
      }
    })
  }

  public toggleEditForm(expense?: ExpenseDto) {
    if (this.showForm) {
      this.showForm = undefined
      this.expenseToEdit = undefined
    } else {
      this.showForm = true
      this.expenseToEdit = expense
    }
  }

  public openDeleteDialog(expense: ExpenseDto): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translateService.instant('EXPENSES.DIALOG_TITLE'),
        text: this.translateService.instant('EXPENSES.DIALOG_TEXT', { name: expense.name }),
        deny: this.translateService.instant('COMMON.CANCEL'),
        accept: this.translateService.instant('COMMON.DELETE'),
        id: expense._id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.deleteExpense(result)
      }
    });
  }

  private deleteExpense(id: string): void {
    this.expenseService.deleteCost(id).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'EXPENSE.DELETED' })
        // this.expandedElements = []
        this.getExpenses()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, ALERT_TYPES.ERROR)
      }
    })
  }

}
