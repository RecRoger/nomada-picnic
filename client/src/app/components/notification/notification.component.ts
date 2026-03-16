import { CommonModule } from '@angular/common';
import { Component, inject, ProviderToken } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { INotification } from '@shared/interfaces';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, TranslateModule],
  template: `
    <span matSnackBarLabel class="notification-title">
      {{data.message | translate}}
    </span>
  `,
})
export class NotificationComponent {
  public data: INotification = inject(MAT_SNACK_BAR_DATA as unknown as ProviderToken<INotification>)


}
