import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly router: Router = inject(Router)

  private readonly authService: AuthService = inject(AuthService)

  public get logged(): boolean {
    return this.authService.isAuthenticated()
  }

  public logout() {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
