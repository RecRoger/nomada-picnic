import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';


@Component({
  selector: 'app-price-bar',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    TranslateModule,
    MatButton,
  ],
  templateUrl: './price-bar.component.html',
  styleUrl: './price-bar.component.scss'
})
export class PriceBarComponent {
  @Input() showBack = false

  @Input() showNext = true

  @Output() onBack = new EventEmitter<void>()

  @Output() onNext = new EventEmitter<void>()

  @Output() onFinish = new EventEmitter<void>()

  public price$ = of(1)
  // public price$ = inject(PriceService).totalPrice$
}