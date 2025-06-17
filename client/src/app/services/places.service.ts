import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { PlaceDto } from '@models/place.dto';
import { ApiResponse } from '@models/api-response.dto';
import { NotificationService } from '@services/notification.service';
import { ALERT_TYPES } from '@enums/alert-types.enum';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private typedCosts$: { [type: string]: Observable<PlaceDto[]> } = {}

  public getPlacesCached(type: string): Observable<PlaceDto[]> {
    if (!this.typedCosts$[type]) {
      this.typedCosts$[type] = this.getPlaces(type).pipe(shareReplay(1))
    }
    return this.typedCosts$[type]
  }

  public getPlaces(type?: string): Observable<PlaceDto[]> {
    return this.http.get<ApiResponse<PlaceDto[]>>(`/api/places` + (type ? `/${type}` : '')).pipe(
      map((response) => {
        if (response) {
          return response.data as PlaceDto[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los lugares:', error);
        this.notificationService.openNotification({ message: 'PLACES.ERROR' }, ALERT_TYPES.ERROR)
        return of([]);
      })
    );
  }

  public createPlace(newPlace: FormData): Observable<PlaceDto | null> {
    return this.http.post<ApiResponse<PlaceDto>>('/api/places', newPlace).pipe(
      map((response) => {
        if (response) {
          return response.data as PlaceDto
        }
        return null
      }),
      catchError((error) => {
        console.error('No se cargaron los lugares:', error);
        return of(null);
      })
    );
  }

  public editPlace(id: string, place: FormData): Observable<PlaceDto | null> {
    return this.http.put<ApiResponse<PlaceDto>>('/api/places/' + id, place).pipe(
      map((response) => {
        if (response) {
          return response.data as PlaceDto
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
    return this.http.delete<ApiResponse<boolean>>('/api/places/' + id).pipe(
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