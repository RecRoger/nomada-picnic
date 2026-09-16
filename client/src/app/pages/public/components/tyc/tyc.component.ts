import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { StaticData } from '@models/static-data';
import { TranslateModule } from '@ngx-translate/core';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-tyc',
  imports: [TranslateModule, DatePipe, NgClass],
  templateUrl: './tyc.component.html',
  styleUrl: './tyc.component.scss'
})
export class TycComponent {
  public WH_NUMBER = BUSINESS_NUMBER

  public readonly tycInfo: StaticData[] = Array.from({ length: 16 }, (_, index) => ({
    title: "PUBLIC.TYC.TERMS.TITLE_" + (index + 1),
    data1: "PUBLIC.TYC.TERMS.DATA_" + (index + 1),
    ...(index === 3 ? {
      highligthed: "PUBLIC.TYC.TERMS.DATA_4_TIP",
      data2: "PUBLIC.TYC.TERMS.DATA_4_END"
    } : {})
  }))

}
