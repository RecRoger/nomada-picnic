import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '@components/notification/notification.component';
import { INotification } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openNotification(data: INotification, type: AlertTypes = AlertTypes.SUCCESS) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: { ...data, type },
      duration: this.durationInSeconds * 1000,
      panelClass: ['alert-' + type],
    });
  }
}
