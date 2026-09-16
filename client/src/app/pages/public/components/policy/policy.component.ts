import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { StaticData } from '@models/static-data';
import { TranslateModule } from '@ngx-translate/core';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-policy',
  imports: [TranslateModule, DatePipe, NgClass],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent {
  public readonly WH_NUMBER = BUSINESS_NUMBER

  public readonly policyInfo: StaticData[] = Array.from({ length: 12 }, (_, index) => ({
    title: "PUBLIC.POLICY.POLICIES.TITLE_" + (index + 1),
    data1: "PUBLIC.POLICY.POLICIES.DATA_" + (index + 1)
  }))
}
