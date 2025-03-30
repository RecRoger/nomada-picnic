import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [TranslateModule, MatButtonModule],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {
  constructor(private router: Router) { }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
