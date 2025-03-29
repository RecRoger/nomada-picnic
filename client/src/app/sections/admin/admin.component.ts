import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TranslateModule, MatTabsModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService)

  private readonly router: Router = inject(Router)

  private readonly route: ActivatedRoute = inject(ActivatedRoute)

  public readonly user = this.authService.user

  public tabs: { link: string, label: string }[] = [
    {
      link: 'admin/picnics',
      label: 'ADMIN.TABS.PICNICS'
    },
    {
      link: 'admin/places',
      label: 'ADMIN.TABS.PLACES'
    },
    {
      link: 'admin/costs',
      label: 'ADMIN.TABS.COSTS'
    },
  ];

  public selectedIndex = 0

  ngOnInit(): void {
    const url = this.router.url;
    this.selectedIndex = this.tabs.findIndex(tab => url.includes(tab.link))
  }

  onTabChange(event: any): void {
    this.router.navigate([this.tabs[event.index]?.link]);
  }
}
