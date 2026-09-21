import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StaticData } from '@models/static-data';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '@services/seo.service';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-policy',
  imports: [TranslatePipe, DatePipe, NgClass],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent implements OnInit {
  public readonly WH_NUMBER = BUSINESS_NUMBER

  public readonly policyInfo: StaticData[] = Array.from({ length: 12 }, (_, index) => ({
    title: "PUBLIC.POLICY.POLICIES.TITLE_" + (index + 1),
    data1: "PUBLIC.POLICY.POLICIES.DATA_" + (index + 1)
  }))

  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: 'policy',
      page: 'POLICIES',
    })
  }
}
