import { Component, inject, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MapsService } from '@services/maps.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlacesService } from '@services/places.service';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '@services/notification.service';
import { PlaceFormComponent } from '@components/place-form/place-form.component';
import { AlertTypes, PlacesTypes } from '@shared/enums';
import { IPlace } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';



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
    ApiImageUrlPipe,
    PlaceFormComponent,
  ],
  templateUrl: './admin-places.component.html',
  styleUrl: './admin-places.component.scss'
})
export class AdminPlacesComponent implements OnInit {
  protected readonly mapService: MapsService = inject(MapsService)

  protected readonly dialog = inject(MatDialog);

  public readonly placeTypes = PlacesTypes

  public places: IPlace[] = [];

  public placeOnEdition = ''

  public mapOptions: google.maps.MapOptions = {
    center: { lat: -34.585758, lng: -58.441039 },
    zoom: 12,
  };

  public markers: any = [];

  public openId?: string = ''

  public newPlaceIndicator: boolean = false

  private readonly placesService: PlacesService = inject(PlacesService)

  private readonly translateService: TranslateService = inject(TranslateService)

  private readonly notificationService: NotificationService = inject(NotificationService)

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

  public createPlace(formPlace: IPlace): void {
    const formData = this.appendForm(formPlace)
    this.placesService.createPlace(formData).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PLACES.ADDED' })
        this.getPlaces()
        this.newPlaceIndicator = false
        this.checkPlace(resp._id)
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  toggleEditForm(place?: IPlace): void {
    this.placeOnEdition = place?._id || ''
  }

  editPlace(formPlace: IPlace): void {
    const formData = this.appendForm(formPlace)
    this.placesService.editPlace(this.placeOnEdition || '', formData).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PLACES.EDITED' })
        this.placeOnEdition = ''
        this.getPlaces()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  private appendForm(formPlace: IPlace): FormData {
    const formData = new FormData();
    formData.append('name', formPlace.name)
    formData.append('type', PlacesTypes.PUBLIC)
    formData.append('location', JSON.stringify(formPlace.location))
    formData.append('description', formPlace.description as string)
    formData.append('detail', formPlace.detail as string)
    formData.append('mapsLink', formPlace.mapsLink as string)
    formData.append('zone', formPlace.zone + '')
    formData.append('transportationCost', formPlace.transportationCost + '')
    // Añadir las imágenes a FormData    
    const images = formPlace.images
    for (let i = 0; i < (images?.length || 0); i++) {
      if (images) {
        formData.append('images', images[i]);
      }
    }
    return formData
  }

  openDeleteDialog(place: IPlace): void {
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
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }
}
