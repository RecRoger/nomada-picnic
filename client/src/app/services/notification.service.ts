import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationData } from '../models/notification.dto';
import { ALERT_TYPES } from '../enums/alert-types.enum';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openNotification(data: NotificationData, type: ALERT_TYPES = ALERT_TYPES.SUCCESS) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: { ...data, type },
      duration: this.durationInSeconds * 1000,
      panelClass: ['alert-' + type],
    });
  }
}
