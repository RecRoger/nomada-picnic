import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { PLACES_TYPES } from '@enums/places-types.enum';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlCastPipe } from '@pipes/form-control-cast.pipe';
import { PlacesService } from '@services/places.service';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
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
export class BasicsFormComponent implements OnInit {
  private readonly placesService = inject(PlacesService)

  @Input() public form: FormGroup = new FormGroup({})

  public places$: Observable<{ value: string, text: string }[]> = of([])

  public placeList: { value: string, text: string }[] = []

  ngOnInit(): void {
    this.getPlaces()
  }

  public getPlaces(): void {
    this.places$ = this.placesService.getPlaces(PLACES_TYPES.PUBLIC).pipe(
      map(places => places
        .map(place => ({ value: place._id!, text: place.name }))
      ),
      tap(places => this.placeList = places)
    )
  }
}
