import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StaticData } from '@models/static-data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tyc',
  imports: [TranslateModule, DatePipe, NgClass, UpperCasePipe],
  templateUrl: './tyc.component.html',
  styleUrl: './tyc.component.scss'
})
export class TycComponent {

  public readonly tycInfo: StaticData[] = Array.from({ length: 16 }, (_, index) => ({
    title: "PUBLIC.TYC.TERMS.TITLE_" + (index + 1),
    data1: "PUBLIC.TYC.TERMS.DATA_" + (index + 1),
    ...(index === 3 ? {
      highligthed: "PUBLIC.TYC.TERMS.DATA_4_TIP",
      data2: "PUBLIC.TYC.TERMS.DATA_4_END"
    } : {})
  }))

}
