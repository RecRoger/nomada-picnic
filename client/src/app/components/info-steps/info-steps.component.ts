import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info-steps',
  imports: [TranslateModule],
  templateUrl: './info-steps.component.html',
  styleUrl: './info-steps.component.scss'
})
export class InfoStepsComponent {
  public stepCards = [
    {
      number: 1,
      title: "PUBLIC.STEPS.FIRST.TITLE",
      text: "PUBLIC.STEPS.FIRST.TEXT"
    },
    {
      number: 2,
      title: "PUBLIC.STEPS.SECOND.TITLE",
      text: "PUBLIC.STEPS.SECOND.TEXT"
    },
    {
      number: 3,
      title: "PUBLIC.STEPS.THIRD.TITLE",
      text: "PUBLIC.STEPS.THIRD.TEXT"
    },
    {
      number: 4,
      title: "PUBLIC.STEPS.FORTH.TITLE",
      text: "PUBLIC.STEPS.FORTH.TEXT"
    },
    {
      number: 5,
      title: "PUBLIC.STEPS.FIFTH.TITLE",
      text: "PUBLIC.STEPS.FIFTH.TEXT"
    },
  ]
}
