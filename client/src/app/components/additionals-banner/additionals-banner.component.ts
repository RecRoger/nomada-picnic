import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-additionals-banner',
  imports: [TranslateModule, RouterLink],
  templateUrl: './additionals-banner.component.html',
  styleUrl: './additionals-banner.component.scss'
})
export class AdditionalsBannerComponent {

}
