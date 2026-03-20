import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '@services/maps.service';
import { PlacesService } from '@services/places.service';
import { PlacesTypes } from '@shared/enums';
import { IPlace } from '@shared/interfaces';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, startWith, tap } from 'rxjs';
import { MAP_OPTIONS } from '@constants/map-options';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PlaceDialogComponent } from '@components/place-dialog/place-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


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
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './places-map.component.html',
  styleUrl: './places-map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PlacesMapComponent implements OnInit {

  protected readonly mapService = inject(MapsService)

  public mapOptions: google.maps.MapOptions = MAP_OPTIONS;

  public markers: any = [];

  public places: IPlace[] = [];

  public readonly searchControl = new FormControl('');

  public options: string[] = [];

  public filteredOptions: Observable<string[]> = of([])

  public hide = false;

  private readonly placesService = inject(PlacesService)

  private readonly destroyRef = inject(DestroyRef)

  readonly dialog = inject(MatDialog);

  private highlightedId: string | null = null

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.getPlaces()
    this.setSearchFilter()
  }

  public selectSearch(value: string): void {
    this.highlightedId = this.places.find(place => place.name === value)?._id || null;
    this.setMarkers();
    const selectedMarker = this.markers.find((m: any) => m.id === this.highlightedId);
    if (selectedMarker) {
      this.mapOptions = { ...this.mapOptions, center: selectedMarker.position, zoom: 15 };
    }
  }

  public checkPlace(id: string): void {
    const place = this.places.find(place => place._id === id)
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      data: place,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // TODO - logica de selccion de lugar
        console.log("Añadir al carrito", id)
      }
    });
  }

  private setSearchFilter(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(''),
      tap(value => {
        if (!value) {
          this.mapOptions = MAP_OPTIONS
        }
      }),
      map(value => this._filter(value || '')),
    );
  }


  private getPlaces(): void {
    this.placesService.getPlacesCached(PlacesTypes.PUBLIC)
      .subscribe(resp => {
        this.places = resp
        this.options = this.places.map(place => place.name)
        this.setMarkers()
      })
  }

  private setMarkers(): void {
    this.markers = this.places.filter(place => place.location?.lat && place.location?.lng).map(place => ({
      position: { lat: Number(place.location?.lat) || 0, lng: Number(place.location?.lng) || 0 },
      label: place.name,
      id: place._id,
      isHighlighted: place._id === this.highlightedId
    }));
  }
}
