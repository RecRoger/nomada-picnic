import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatTabsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  protected readonly authService: AuthService = inject(AuthService)


  public readonly user = this.authService.user

  public tabs: { link: string, label: string }[] = [
    {
      link: 'picnics',
      label: 'ADMIN.TABS.PICNICS'
    },
    {
      link: 'places',
      label: 'ADMIN.TABS.PLACES'
    },
    {
      link: 'costs',
      label: 'ADMIN.TABS.COSTS'
    },
    {
      link: 'expenses',
      label: 'ADMIN.TABS.EXPENSES'
    },
  ];

  public activeLinkIndex = 0

  private readonly router: Router = inject(Router)

  ngOnInit(): void {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.activeLinkIndex = this.tabs.indexOf(
        this.tabs.find(tab => this.router.url.includes(tab.link))!
      );
    });
  }
}
