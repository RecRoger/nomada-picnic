import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPlace } from '@shared/interfaces';
import { AlertTypes, ComunicationStatus } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private typedCosts$: { [type: string]: Observable<IPlace[]> } = {}

  public getPlacesCached(type: string): Observable<IPlace[]> {
    if (!this.typedCosts$[type]) {
      this.typedCosts$[type] = this.getPlaces(type).pipe(shareReplay(1))
    }
    return this.typedCosts$[type]
  }

  public getPlaces(type?: string): Observable<IPlace[]> {
    return this.http.get<IApiResponse<IPlace[]>>(`/api/places`, {
      params: { ...(type ? { type } : {}) }
    }).pipe(
      map((response) => {
        if (response?.status == ComunicationStatus.OK) {
          return response.data as IPlace[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los lugares:', error);
        this.notificationService.openNotification({ message: 'PLACES.ERROR' }, AlertTypes.ERROR)
        return of([]);
      })
    );
  }

  public createPlace(newPlace: FormData): Observable<IPlace | null> {
    return this.http.post<IApiResponse<IPlace>>('/api/places', newPlace).pipe(
      map((response) => {
        if (response) {
          return response.data as IPlace
        }
        return null
      }),
      catchError((error) => {
        console.error('No se cargaron los lugares:', error);
        return of(null);
      })
    );
  }

  public editPlace(id: string, place: FormData): Observable<IPlace | null> {
    return this.http.put<IApiResponse<IPlace>>('/api/places/' + id, place).pipe(
      map((response) => {
        if (response) {
          return response.data as IPlace
        }
        return null
      }),
      catchError((error) => {
        console.error('No se eliminó el lugar:', error);
        return of(null);
      })
    );
  }

  public deletePlace(id: string): Observable<boolean> {
    return this.http.delete<IApiResponse<boolean>>('/api/places/' + id).pipe(
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