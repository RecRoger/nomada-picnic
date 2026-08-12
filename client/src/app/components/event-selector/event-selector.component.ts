import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { EventsService } from '@services/events.service';
import { IPicnicEvent } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-selector',
  imports: [AsyncPipe, TranslateModule, MatIconModule, AppleEmojiPipe],
  templateUrl: './event-selector.component.html',
  styleUrl: './event-selector.component.scss'
})
export class EventSelectorComponent implements AfterViewInit {
  @Output() selectEvent: EventEmitter<IPicnicEvent> = new EventEmitter()

  protected readonly eventsService = inject(EventsService)

  public pricesGroups$?: Observable<IPicnicEvent[]>

  public selectedEvent?: IPicnicEvent

  ngAfterViewInit(): void {
    this.pricesGroups$ = this.eventsService.getEventsCached()
  }

  selectGroup(group: IPicnicEvent) {
    if (!this.selectedEvent || this.selectedEvent !== group) {
      this.selectedEvent = group
    } else {
      this.selectedEvent = undefined
    }
    this.selectEvent.emit(this.selectedEvent)
  }
}
