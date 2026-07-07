import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-places-banner',
  imports: [TranslateModule, RouterLink],
  templateUrl: './places-banner.component.html',
  styleUrl: './places-banner.component.scss'
})
export class PlacesBannerComponent {

}
