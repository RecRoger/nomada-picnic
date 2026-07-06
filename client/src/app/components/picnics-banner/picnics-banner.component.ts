import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-picnics-banner',
  imports: [TranslateModule, RouterLink],
  templateUrl: './picnics-banner.component.html',
  styleUrl: './picnics-banner.component.scss'
})
export class PicnicsBannerComponent {

}
