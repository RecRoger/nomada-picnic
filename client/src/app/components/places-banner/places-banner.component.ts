import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-places-banner',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './places-banner.component.html',
  styleUrl: './places-banner.component.scss'
})
export class PlacesBannerComponent {

}
