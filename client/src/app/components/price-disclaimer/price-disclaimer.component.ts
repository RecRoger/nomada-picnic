import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';

@Component({
  selector: 'app-price-disclaimer',
  imports: [TranslatePipe, MatDialogModule, AppleEmojiPipe],
  templateUrl: './price-disclaimer.component.html',
  styleUrl: './price-disclaimer.component.scss'
})
export class PriceDisclaimerComponent {
  readonly dialogRef = inject(MatDialogRef<PriceDisclaimerComponent>);
}
