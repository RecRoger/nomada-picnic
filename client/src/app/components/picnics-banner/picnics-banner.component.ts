import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-picnics-banner',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './picnics-banner.component.html',
  styleUrl: './picnics-banner.component.scss'
})
export class PicnicsBannerComponent {

}
