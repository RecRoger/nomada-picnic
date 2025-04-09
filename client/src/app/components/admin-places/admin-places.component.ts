import { Component, inject, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MapsService } from '../../services/maps.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlacesService } from '../../services/places.service';
import { PlaceDto } from '../../models/place.dto';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlaceFormComponent } from '../place-form/place-form.component';
import { PLACES_TYPES } from '../../enums/places-types.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { ALERT_TYPES } from '../../enums/alert-types.enum';



@Component({
  selector: 'app-places',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GoogleMapsModule,
    GoogleMap,
    MapAdvancedMarker,
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

  private readonly translateService: TranslateService = inject(TranslateService)

  private readonly notificationService: NotificationService = inject(NotificationService)

  public readonly dialog = inject(MatDialog);

  public readonly placeTypes = PLACES_TYPES

  public places: PlaceDto[] = [];

  public placeOnEdition = ''

  public mapOptions: google.maps.MapOptions = {
    center: { lat: -34.585758, lng: -58.441039 },
    zoom: 12,
  };

  public markers: any = [];

  public openId?: string = ''

  public newPlaceIndicator: boolean = false

  ngOnInit(): void {
    this.getPlaces()
  }

  private getPlaces(): void {
    this.placesService.getPlaces()
      .subscribe(resp => {
        this.places = resp
        this.setMarkers()
      })
  }

  private setMarkers(): void {
    this.markers = this.places.filter(place => place.location?.lat && place.location?.lng).map(place => ({
      position: { lat: Number(place.location?.lat) || 0, lng: Number(place.location?.lng) || 0 },
      label: place.name,
      id: place._id
    }));
  }

  public checkPlace(id: string = ''): void {
    this.openId = id
  }

  public createPlace(formPlace: PlaceDto): void {
    const formData = this.appendForm(formPlace)
    this.placesService.createPlace(formData).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PLACES.ADDED' })
        this.getPlaces()
        this.newPlaceIndicator = false
        this.checkPlace(resp._id)
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, ALERT_TYPES.ERROR)
      }
    })
  }

  toggleEditForm(place?: PlaceDto): void {
    this.placeOnEdition = place?._id || ''
  }

  editPlace(formPlace: PlaceDto): void {
    const formData = this.appendForm(formPlace)
    this.placesService.editPlace(this.placeOnEdition || '', formData).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PLACES.EDITED' })
        this.placeOnEdition = ''
        this.getPlaces()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, ALERT_TYPES.ERROR)
      }
    })
  }

  private appendForm(formPlace: PlaceDto): FormData {
    const formData = new FormData();
    formData.append('name', formPlace.name)
    formData.append('type', PLACES_TYPES.PUBLIC)
    formData.append('location', JSON.stringify(formPlace.location))
    formData.append('description', formPlace.description)
    formData.append('mapsLink', formPlace.mapsLink)
    formData.append('zone', formPlace.zone + '')
    formData.append('transportationCost', formPlace.transportationCost + '')
    // Añadir las imágenes a FormData    
    const images = formPlace.images
    for (let i = 0; i < images?.length; i++) {
      formData.append('images', images[i]);
    }
    return formData
  }

  openDeleteDialog(place: PlaceDto): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translateService.instant('PLACES.DIALOG_TITLE'),
        text: this.translateService.instant('PLACES.DIALOG_TEXT', { name: place.name }),
        deny: this.translateService.instant('COMMON.CANCEL'),
        accept: this.translateService.instant('COMMON.DELETE'),
        id: place._id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.deletePlace(result)
      }
    });
  }

  deletePlace(id: string): void {
    this.placesService.deletePlace(id).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PLACES.DELETED' })
        this.getPlaces()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, ALERT_TYPES.ERROR)
      }
    })
  }
}
