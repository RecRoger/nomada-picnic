import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userAdmin: { email?: string, name?: string } | undefined;

  private readonly SECRET_KEY = 'ultrasecret'; // Reemplaza con tu clave secreta

  private readonly COOKIE_NAME = 'NomadaAdmin'

  private readonly COOKIE_NAME_EMAIL = 'NomadaAdminEmail'

  private readonly http: HttpClient = inject(HttpClient)

  private readonly cookieService: CookieService = inject(CookieService)

  public isAuthenticated(): boolean {
    return this.cookieService.check(this.COOKIE_NAME);
  }

  public get user(): { email?: string, name?: string } {
    return this.userAdmin || {
      name: this.cookieService.get(this.COOKIE_NAME),
      email: this.cookieService.get(this.COOKIE_NAME_EMAIL)
    };
  }

  public login(email: string, password: string): Observable<any> {
    const secret = this.SECRET_KEY
    return this.http.post<{ email: string, name: string }>('/api/auth/validate', { email, password, secret }).pipe(
      tap((response) => {
        if (response) {
          this.userAdmin = response
          const expirationDate = new Date();
          expirationDate.setMinutes(expirationDate.getMinutes() + 45);
          this.cookieService.set(this.COOKIE_NAME, response.name, { expires: expirationDate, sameSite: 'Strict' })
          this.cookieService.set(this.COOKIE_NAME_EMAIL, response.email, { expires: expirationDate, sameSite: 'Strict' })
        }
      }),
      catchError((error) => {
        console.error('Error de autenticación:', error);
        return of({});
      })
    );
  }

  public logout(): void {
    this.cookieService.delete(this.COOKIE_NAME);
  }
}