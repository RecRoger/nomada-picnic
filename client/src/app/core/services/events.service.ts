import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPicnicEvent } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private cachedEvents$?: Observable<IPicnicEvent[]>

  public getEventsCached(): Observable<IPicnicEvent[]> {
    if (!this.cachedEvents$) {
      this.cachedEvents$ = this.getEvents().pipe(shareReplay(1))
    }
    return this.cachedEvents$
  }

  public getEvents(isPrivate = false): Observable<IPicnicEvent[]> {
    return this.http.get<IApiResponse<IPicnicEvent[]>>(`${API_URL}/api/events`, {
      params: { ...(isPrivate ? { query: 'full' } : {}) }
    }).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicEvent[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los tipos de eventos:', error);
        this.notificationService.openNotification({ message: 'EVENTS.ERROR' }, AlertTypes.ERROR)
        return of([]);
      })
    );
  }

  public createEvent(event: IPicnicEvent): Observable<IPicnicEvent | null> {
    return this.http.post<IApiResponse<IPicnicEvent>>(API_URL + '/api/events', event).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicEvent
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el evento:', error);
        return of(null);
      })
    );
  }

  public editEvent(id: string, event: IPicnicEvent): Observable<IPicnicEvent | null> {
    return this.http.put<IApiResponse<IPicnicEvent>>(`${API_URL}/api/events/${id}`, event).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicEvent
        }
        return null
      }),
      catchError((error) => {
        console.error('No se editó el evento:', error);
        return of(null);
      })
    );
  }

  public deleteEvent(id: string): Observable<boolean> {
    return this.http.delete<IApiResponse<boolean>>(`${API_URL}/api/events/${id}`).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se eliminó el evento:', error);
        return of(false);
      })
    );
  }
}