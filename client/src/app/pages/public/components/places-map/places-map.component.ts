import { CommonModule, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '@services/maps.service';
import { PlacesService } from '@services/places.service';
import { PlacesTypes } from '@shared/enums';
import { IPlace } from '@shared/interfaces';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, startWith, tap } from 'rxjs';
import { MAP_OPTIONS } from '@constants/map-options';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PlaceDialogComponent } from '@components/place-dialog/place-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';
import { normalizeString } from 'src/app/core/functions/search';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CartService } from '@services/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-places-map',
  imports: [
    CommonModule,
    TranslateModule,
    GoogleMapsModule,
    GoogleMap,
    MapAdvancedMarker,
    MatIconModule,
    ...MAT_FORMS_MODULES,
    ApiImageUrlPipe,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AppleEmojiPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './places-map.component.html',
  styleUrl: './places-map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PlacesMapComponent implements OnInit {

  protected readonly mapService = inject(MapsService)

  protected readonly fb = inject(FormBuilder)

  public activeTab = signal<'list' | 'map'>('list');

  public mapOptions: google.maps.MapOptions = MAP_OPTIONS;

  public markers: any = [];

  public placesList: IPlace[] = [];

  public filteredList: IPlace[] = [];

  public options: string[] = [];

  public tagList: string[] = []

  public filteredOptions: Observable<string[]> = of([])

  public filterForm = this.fb.group({
    keyword: '',
    tags: [['']],
  })

  public readonly recomendedTag = RECOMENDED_TAG

  public highlightedIds: string[] = []

  private readonly placesService = inject(PlacesService)

  private readonly cartService = inject(CartService)

  private readonly router = inject(Router)

  private readonly destroyRef = inject(DestroyRef)

  readonly dialog = inject(MatDialog);

  private platformId = inject(PLATFORM_ID);


  async ngOnInit(): Promise<void> {
    this.getPlaces()
    this.setFilters()
    if (isPlatformBrowser(this.platformId)) {
      if (typeof google !== 'undefined' && google.maps) {
        await google.maps.importLibrary('marker');
      }
    }
  }

  public toggleTag(tag: string): void {
    const current: string[] = this.filterForm.get('tags')?.value || [];
    if (current.includes(tag)) {
      this.filterForm.get('tags')?.setValue(current.filter(t => t !== tag));
    } else {
      this.filterForm.get('tags')?.setValue([...current, tag]);
    }
  }

  public checkPlace(id: string): void {
    const place = this.placesList.find(place => place._id === id)
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      data: place,
      width: '750px',
      maxWidth: '90vw',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.updateBookingDetails({
          place
        })
        this.router.navigate(['/picnics'])
      }
    });
  }


  private getPlaces(): void {
    this.placesService.getPlacesCached(PlacesTypes.PUBLIC)
      .subscribe(resp => {
        this.placesList = resp
        this.filteredList = this.placesList
        if (resp.length) {
          this.options = this.placesList.map(place => place.name)
          const rawTags = this.placesList.flatMap(place => place.tags);
          this.tagList = Array.from(new Set(rawTags)) as string[];
          this.setMarkers()
          this.filterCosts()
        }
      })
  }

  private setMarkers(): void {
    this.markers = this.placesList.filter(place => place.location?.lat && place.location?.lng).map(place => ({
      position: { lat: Number(place.location?.lat) || 0, lng: Number(place.location?.lng) || 0 },
      label: place.name,
      id: place._id,
    }));
  }

  private setFilters(): void {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.filterCosts()
      })
  }

  private filterCosts(): void {
    const keyValue: string = this.filterForm.get('keyword')?.value || ''
    const tagsValues: string[] = this.filterForm.get('tags')?.value || []

    if (!keyValue) {
      this.filteredList = this.placesList
    } else {
      if (keyValue.trim() != '') {
        const normalizedKey = normalizeString(keyValue)
        this.filteredList = this.filteredList.filter(cost => {
          const normalizedItem = normalizeString(cost.name);
          return normalizedItem.includes(normalizedKey);
        })
      }
    }
    if (tagsValues.length > 1) {
      const selectedTagsSet = new Set(tagsValues);
      this.filteredList = this.filteredList.filter(item =>
        item.tags && item.tags.some(tag => selectedTagsSet.has(tag))
      );
    }
    this.highlightedIds = this.filteredList.map(place => place._id || '')
  }
}
