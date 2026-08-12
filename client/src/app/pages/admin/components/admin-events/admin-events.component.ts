import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '@services/notification.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { ICost, IPicnicEvent } from '@shared/interfaces';
import { AlertTypes, CostsTypes } from '@shared/enums';
import { EventsService } from '@services/events.service';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { CostsService } from '@services/costs.service';
import { forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';


const MAT_MODULES = [
  MatExpansionModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule
]
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    TranslateModule,
    ...MAT_MODULES,
    FormControlComponent,
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    AppleEmojiPipe,
  ],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
})
export class AdminEventsComponent implements OnInit {
  private readonly eventsService: EventsService = inject(EventsService)

  private readonly translateService: TranslateService = inject(TranslateService)

  public readonly dialog = inject(MatDialog);

  private readonly notificationService: NotificationService = inject(NotificationService)

  public eventsList: IPicnicEvent[] = [];

  public showForm?: boolean

  public eventToEdit?: IPicnicEvent

  private fb = inject(FormBuilder)

  public eventForm: FormGroup = this.fb.group({
    icon: ['', Validators.required],
    name: ['', Validators.required],
    recomendedAditionals: [[], Validators.required]
  })

  public additionalsCosts: ICost[] = []

  private readonly costService = inject(CostsService)

  ngOnInit(): void {
    this.getAdditionalCosts()
    this.getEvents()
  }

  public getControl(controlName: string): FormControl {
    return this.eventForm.get(controlName) as FormControl
  }

  public getEvents(): void {
    this.eventsService.getEvents(true)
      .subscribe(list => {
        this.eventsList = list
      })
  }

  public saveEvent() {
    const formData = this.eventForm.value
    const request = (this.eventToEdit)
      ? this.eventsService.editEvent(this.eventToEdit._id || '', formData)
      : this.eventsService.createEvent(formData)

    request.subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: this.eventToEdit ? 'EXPENSES.EDITED' : 'EXPENSES.ADDED' })
        this.getEvents()
        this.toggleEditForm()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  public toggleEditForm(event?: IPicnicEvent) {
    if (this.showForm) {
      this.showForm = undefined
      this.eventToEdit = undefined
    } else {
      this.showForm = true
      if (event) {
        this.eventForm.setValue({
          icon: event.icon,
          name: event.name,
          recomendedAditionals: event.recomendedAditionals?.map(additionals => this.additionalsCosts.find(cost => cost.name === additionals)?._id),
        })
      } else {
        this.eventForm.reset()
      }
      this.eventToEdit = event
    }
  }

  public openDeleteDialog(event: IPicnicEvent): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translateService.instant('EVENTS.DIALOG_TITLE'),
        text: this.translateService.instant('EVENTS.DIALOG_TEXT', { name: event.name }),
        deny: this.translateService.instant('COMMON.CANCEL'),
        accept: this.translateService.instant('COMMON.DELETE'),
        id: event._id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.deleteEvent(result)
      }
    });
  }

  private deleteEvent(id: string): void {
    this.eventsService.deleteEvent(id).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'EVENT.DELETED' })
        this.getEvents()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  private getAdditionalCosts(): void {
    forkJoin([
      this.costService.getCostsCached(CostsTypes.FURNITURE),
      this.costService.getCostsCached(CostsTypes.DRINKS),
      this.costService.getCostsCached(CostsTypes.ADDITIONAL),
      this.costService.getCostsCached(CostsTypes.FOOD)
    ]).subscribe(([respFurniture, respDrinks, respAdditional, respFood]) => {
      const list = [...respFurniture, ...respDrinks, ...respAdditional, ...respFood]
      this.additionalsCosts = list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    })
  }

}
