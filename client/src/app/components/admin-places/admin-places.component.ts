import { Component, inject, OnInit } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MapsService } from '../../services/maps.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlacesService } from '../../services/places.service';
import { PlaceDto } from '../../models/place.dto';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PlaceFormComponent } from '../place-form/place-form.component';
import { PLACES_TYPES } from '../../enums/places-types.enum';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GoogleMap,
    MapMarker,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    PlaceFormComponent,
  ],
  templateUrl: './admin-places.component.html',
  styleUrl: './admin-places.component.scss'
})
export class AdminPlacesComponent implements OnInit {
  public readonly mapService: MapsService = inject(MapsService)

  public readonly placesService: PlacesService = inject(PlacesService)

  public readonly placeTypes = PLACES_TYPES

  public places: PlaceDto[] = [];

  public mapOptions: google.maps.MapOptions = {
    center: { lat: -34.585758, lng: -58.441039 },
    zoom: 12,
  };

  public markers = [
    // { position: { lat: 37.7749, lng: -122.4194 }, label: 'San Francisco' },
    // { position: { lat: 37.8044, lng: -122.2711 }, label: 'Oakland' }
  ];

  public openId?: string = ''

  public newPlaceIndicator: boolean = false

  ngOnInit(): void {
    this.placesService.getPlaces().subscribe(resp => {
      this.places = resp
    })
  }

  private getPlaces() {
    this.placesService.getPlaces().subscribe(resp => {
      this.places = resp
    })
  }

  public checkPlace(id?: string): void {
    this.openId = id
  }

  public newPlace(formPlace: PlaceDto): void {
    const formData = new FormData();
    formData.append('name', formPlace.name)
    formData.append('type', PLACES_TYPES.PUBLIC)
    formData.append('description', formPlace.description)
    formData.append('mapsLink', formPlace.mapsLink)
    formData.append('zone', formPlace.zone + '')
    formData.append('transportationCost', formPlace.transportationCost + '')
    // Añadir las imágenes a FormData    
    const images = formPlace.images
    for (let i = 0; i < images?.length; i++) {
      formData.append('images', images[i]);
    }
    this.placesService.createPlace(formData).subscribe(resp => {
      if (resp) {
        this.getPlaces()
        this.newPlaceIndicator = false
        this.checkPlace(resp._id)
      }
    })
  }
}
