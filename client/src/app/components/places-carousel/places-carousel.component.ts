import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlacesService } from '@services/places.service';
import { PlacesTypes } from '@shared/enums';
import { map } from 'rxjs';
import { RouterLink } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-places-carousel',
  imports: [TranslateModule, AsyncPipe, RouterLink, MatIconModule],
  providers: [PlacesService],
  templateUrl: './places-carousel.component.html',
  styleUrl: './places-carousel.component.scss'
})
export class PlacesCarouselComponent {
  protected places$ = inject(PlacesService).getPlacesCached(PlacesTypes.PUBLIC)
    .pipe(map(list => list.length ? list.slice(0, 3) : null))
}
