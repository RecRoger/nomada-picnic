import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@constants/api-url';
import { NotificationService } from '@services/notification.service';
import { AlertTypes } from '@shared/enums';
import { IAgencyContact, IApiResponse } from '@shared/interfaces';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private readonly http: HttpClient = inject(HttpClient)
  private readonly notificationService: NotificationService = inject(NotificationService)

  public sendAgencyContact(contact: IAgencyContact): Observable<boolean> {
    return this.http.post<IApiResponse<boolean>>(`${API_URL}/api/packages/agencies`, contact).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se cargaron los gastos:', error);
        this.notificationService.openNotification({ message: 'PUBLIC.PACKAGES.CORPORATIVE.FORM.ERROR' }, AlertTypes.ERROR)
        return of(false);
      })
    );
  }
}
