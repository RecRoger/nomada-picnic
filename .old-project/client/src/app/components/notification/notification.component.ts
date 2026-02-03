import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationData } from '@models/notification.dto';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <span class="notification-title">
      {{data.message | translate}}
    </span>
  `,
})
export class NotificationComponent {
  data: NotificationData = inject(MAT_SNACK_BAR_DATA);

}
