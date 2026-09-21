import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StaticData } from '@models/static-data';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '@services/seo.service';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-tyc',
  imports: [TranslatePipe, DatePipe, NgClass],
  templateUrl: './tyc.component.html',
  styleUrl: './tyc.component.scss'
})
export class TycComponent implements OnInit {
  public WH_NUMBER = BUSINESS_NUMBER

  public readonly tycInfo: StaticData[] = Array.from({ length: 16 }, (_, index) => ({
    title: "PUBLIC.TYC.TERMS.TITLE_" + (index + 1),
    data1: "PUBLIC.TYC.TERMS.DATA_" + (index + 1),
    ...(index === 3 ? {
      highligthed: "PUBLIC.TYC.TERMS.DATA_4_TIP",
      data2: "PUBLIC.TYC.TERMS.DATA_4_END"
    } : {})
  }))

  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: 'terms',
      page: 'TERMS',
    })
  }

}
