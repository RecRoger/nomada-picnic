import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StaticData } from '@models/static-data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tyc',
  imports: [TranslateModule, DatePipe, NgClass],
  templateUrl: './tyc.component.html',
  styleUrl: './tyc.component.scss'
})
export class TycComponent {
  public readonly tycInfo: StaticData[] = [
    {
      title: "PUBLIC.TYC.TERMS.TITLE_1",
      data1: "PUBLIC.TYC.TERMS.DATA_1"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_2",
      data1: "PUBLIC.TYC.TERMS.DATA_2"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_3",
      data1: "PUBLIC.TYC.TERMS.DATA_3"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_4",
      data1: "PUBLIC.TYC.TERMS.DATA_4",
      highligthed: "PUBLIC.TYC.TERMS.DATA_4_TIP",
      data2: "PUBLIC.TYC.TERMS.DATA_4_END",
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_5",
      data1: "PUBLIC.TYC.TERMS.DATA_5"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_6",
      data1: "PUBLIC.TYC.TERMS.DATA_6"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_7",
      data1: "PUBLIC.TYC.TERMS.DATA_7"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_8",
      data1: "PUBLIC.TYC.TERMS.DATA_8"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_9",
      data1: "PUBLIC.TYC.TERMS.DATA_9"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_10",
      data1: "PUBLIC.TYC.TERMS.DATA_10"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_11",
      data1: "PUBLIC.TYC.TERMS.DATA_11"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_12",
      data1: "PUBLIC.TYC.TERMS.DATA_12"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_13",
      data1: "PUBLIC.TYC.TERMS.DATA_13"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_14",
      data1: "PUBLIC.TYC.TERMS.DATA_14"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_15",
      data1: "PUBLIC.TYC.TERMS.DATA_16"
    },
    {
      title: "PUBLIC.TYC.TERMS.TITLE_16",
      data1: "PUBLIC.TYC.TERMS.DATA_15"
    },
  ]
}
