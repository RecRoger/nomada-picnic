import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPlace } from '@shared/interfaces';
import { AlertTypes, ComunicationStatus, PlacesTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private typedPlaces$: { [type: string]: Observable<IPlace[]> } = {}

  public getPlacesCached(type: PlacesTypes): Observable<IPlace[]> {
    if (!this.typedPlaces$[type]) {
      this.typedPlaces$[type] = this.getPlaces(type).pipe(shareReplay(1))
    }
    return this.typedPlaces$[type]
  }

  public getPlaces(type?: PlacesTypes): Observable<IPlace[]> {
    return this.http.get<IApiResponse<IPlace[]>>(`${API_URL}/api/places`, {
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
    return this.http.post<IApiResponse<IPlace>>(`${API_URL}/api/places`, newPlace).pipe(
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
    return this.http.put<IApiResponse<IPlace>>(`${API_URL}/api/places/${id}`, place).pipe(
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
    return this.http.delete<IApiResponse<boolean>>(`${API_URL}/api/places/${id}`).pipe(
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