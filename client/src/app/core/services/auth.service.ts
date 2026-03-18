import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '@services/notification.service';
import { AlertTypes, ComunicationStatus } from '@shared/enums';
import { IApiResponse, IUser } from '@shared/interfaces';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly notificationService: NotificationService = inject(NotificationService)

  private readonly http: HttpClient = inject(HttpClient)

  private readonly cookieService: CookieService = inject(CookieService)

  private userAdmin: { email?: string, name?: string } | undefined;

  private readonly SECRET_KEY = 'ultrasecret'; // Reemplaza con tu clave secreta

  private readonly COOKIE_NAME = 'NomadaAdmin'

  private readonly COOKIE_NAME_EMAIL = 'NomadaAdminEmail'

  public isAuthenticated(): boolean {
    return this.cookieService.check(this.COOKIE_NAME);
  }

  public get user(): { email?: string, name?: string } {
    return this.userAdmin || {
      name: this.cookieService.get(this.COOKIE_NAME),
      email: this.cookieService.get(this.COOKIE_NAME_EMAIL)
    };
  }

  public login(email: string, password: string): Observable<IApiResponse<IUser>> {
    const secret = this.SECRET_KEY
    return this.http.post<IApiResponse<IUser>>(API_URL + '/api/auth/validate', { email, password, secret })
      .pipe(
        tap((response) => {
          if (response.status === ComunicationStatus.OK && response?.data?.email) {
            this.userAdmin = response.data
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 160);
            this.cookieService.set(this.COOKIE_NAME, this.userAdmin?.name as string, { expires: expirationDate, sameSite: 'Strict' })
            this.cookieService.set(this.COOKIE_NAME_EMAIL, this.userAdmin?.email as string, { expires: expirationDate, sameSite: 'Strict' })
          }
        }),
        catchError((error) => {
          console.error('Error de autenticación:', error);
          this.notificationService.openNotification({ message: "COMMON.GENERIC_ERROR" }, AlertTypes.ERROR)
          throw error
        })
      );
  }

  public logout(): void {
    this.cookieService.delete(this.COOKIE_NAME);
  }
}