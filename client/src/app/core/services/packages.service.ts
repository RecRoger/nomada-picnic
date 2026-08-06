import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPicnicPackage } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private picnicPackages$: { [id: string]: Observable<IPicnicPackage> } = {}

  public getPackages(isPublic: boolean = true): Observable<IPicnicPackage[]> {
    return this.http.get<IApiResponse<IPicnicPackage[]>>(`${API_URL}/api/packages`, {
      params: { ...(isPublic ? {} : { query: 'full' }) }
    }).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicPackage[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los paquetes:', error);
        this.notificationService.openNotification({ message: 'PACKAGES.ERROR' }, AlertTypes.ERROR)
        return of([]);
      })
    );
  }

  // TODO - consultar y chachear un solo paquete
  // public getPackageCached(id: string, isPublic: boolean): Observable<IPicnicPackage> {
  //   if (!this.picnicPackages$[id]) {
  //     this.picnicPackages$[id] = this.getPackages(isPublic).pipe(shareReplay(1))
  //   }
  //   return this.picnicPackages$[id]
  // }


  public createPackage(pkg: FormData): Observable<IPicnicPackage | null> {
    return this.http.post<IApiResponse<IPicnicPackage>>(API_URL + '/api/packages', pkg).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicPackage
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el paquete:', error);
        return of(null);
      })
    );
  }

  public editPackage(id: string, cost: FormData): Observable<IPicnicPackage | null> {
    return this.http.put<IApiResponse<IPicnicPackage>>(`${API_URL}/api/packages/${id}`, cost).pipe(
      map((response) => {
        if (response) {
          return response.data as IPicnicPackage
        }
        return null
      }),
      catchError((error) => {
        console.error('No se editó el paquete:', error);
        return of(null);
      })
    );
  }

  public deletePackage(id: string): Observable<boolean> {
    return this.http.delete<IApiResponse<boolean>>(`${API_URL}/api/packages/${id}`).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se eliminó el paquete:', error);
        return of(false);
      })
    );
  }
}