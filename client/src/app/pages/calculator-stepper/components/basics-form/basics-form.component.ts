import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlCastPipe } from '@pipes/form-control-cast.pipe';
import { PlacesService } from '@services/places.service';
import { PlacesTypes } from '@shared/enums';
import { map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-basics-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ...MAT_FORMS_MODULES,
    FormControlComponent,
    FormControlCastPipe,
  ],
  templateUrl: './basics-form.component.html',
  styleUrl: './basics-form.component.scss'
})
export class BasicsFormComponent {
  private readonly placesService = inject(PlacesService)

  @Input() public form?: FormGroup = new FormGroup({})

  public places$: Observable<{ value: string, text: string }[] | null> = this.placesService.getPlacesCached(PlacesTypes.PUBLIC).pipe(
    map(places => places.length ?
      places.map(place => ({ value: place._id!, text: place.name })) : null
    ),
    tap(places => { if (places) { this.placeList = places } })
  )

  public placeList: { value: string, text: string }[] = []
}
