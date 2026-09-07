import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPaginatedPicnics, IPaginationOptions } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class PicnicsService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  public findAllPicnics(options: IPaginationOptions): Observable<IPaginatedPicnics | null> {
    let params = new HttpParams()
      .set('page', options.page.toString())
      .set('limit', options.limit.toString())
      .set('sortBy', options.sortBy)
      .set('sortOrder', options.sortOrder);

    return this.http.get<IApiResponse<IPaginatedPicnics>>(`${API_URL}/api/picnics`, { params }).pipe(
      map((response: any) => response.data),
      catchError((error) => {
        console.error('No se cargaron los picnics:', error);
        this.notificationService.openNotification(
          { message: 'PICNICS.ERROR' },
          AlertTypes.ERROR
        );
        return of(null);
      })
    );
  }

  public editPicnic(id: string, place: FormData): Observable<IPicnicDetail | null> {
    return this.http.put<IApiResponse<IPicnicDetail>>(`${API_URL}/api/picnics/${id}`, place).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicDetail
        }
        return null
      }),
      catchError((error) => {
        console.error('No se eliminó el lugar:', error);
        return of(null);
      })
    );
  }

  public deletePicnic(id: string): Observable<boolean> {
    return this.http.delete<IApiResponse<boolean>>(`${API_URL}/api/picnics/${id}`).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se eliminó el lugar:', error);
        return of(false);
      })
    );
  }
}