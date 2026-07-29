import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StaticData } from '@models/static-data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-policy',
  imports: [TranslateModule, DatePipe, NgClass, UpperCasePipe],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent {

  public readonly policyInfo: StaticData[] = Array.from({ length: 12 }, (_, index) => ({
    title: "PUBLIC.POLICY.POLICIES.TITLE_" + (index + 1),
    data1: "PUBLIC.POLICY.POLICIES.DATA_" + (index + 1)
  }))
}
