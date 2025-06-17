import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PriceService } from '@services/price.service';


@Component({
  selector: 'app-price-bar',
  standalone: true,
  imports: [
    CommonModule,
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

  public price$ = inject(PriceService).totalPrice$
}
