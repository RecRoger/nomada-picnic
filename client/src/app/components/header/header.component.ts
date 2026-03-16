import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public openMenu = false

  public menuLinks: any[] = [
    {
      link: '',
      label: 'PUBLIC.MENU.TABS.HOME',
      options: { exact: true }
    },
    {
      link: 'places',
      label: 'PUBLIC.MENU.TABS.PLACES'
    },
    {
      link: 'additionals',
      label: 'PUBLIC.MENU.TABS.ADDITIONALS'
    },
    {
      link: 'picnics',
      label: 'PUBLIC.MENU.TABS.PICNICS'
    },
    {
      link: 'calculator',
      label: 'PUBLIC.MENU.TABS.CALCULATOR'
    },
    {
      link: 'contact',
      label: 'PUBLIC.MENU.TABS.CONTACT'
    },
  ];

  public activeLinkIndex = 0

  private readonly router = inject(Router)

  private readonly authService = inject(AuthService)

  public get logged(): boolean {
    return this.authService.isAuthenticated()
  }

  public logout() {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
