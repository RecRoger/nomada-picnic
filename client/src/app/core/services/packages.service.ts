import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IPackagePrice, IPicnicPackage } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private picnicPackages$?: Observable<IPicnicPackage[]>

  private packagesPrice$: { [id: string]: Observable<IPackagePrice[]> } = {}

  public getPackagesCached(): Observable<IPicnicPackage[]> {
    if (!this.picnicPackages$) {
      this.picnicPackages$ = this.getPackages().pipe(shareReplay(1))
    }
    return this.picnicPackages$
  }

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

  public getPackagePricesCached(id: string): Observable<IPackagePrice[]> {
    if (!this.packagesPrice$[id]) {
      this.packagesPrice$[id] = this.getPackagePrices(id).pipe(shareReplay(1))
    }
    return this.packagesPrice$[id]
  }

  public getPackagePrices(id: string, isPublic: boolean = true): Observable<IPackagePrice[]> {
    return this.http.get<IApiResponse<IPackagePrice[]>>(`${API_URL}/api/packages/${id}/prices`, {
      params: { ...(isPublic ? {} : { query: 'full' }) }
    }).pipe(
      map((response) => {
        if (response) {
          return response.data as IPackagePrice[]
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