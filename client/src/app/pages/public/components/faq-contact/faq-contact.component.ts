import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { StaticData } from '@models/static-data';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '@services/seo.service';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-faq-contact',
  imports: [TranslatePipe, MatExpansionModule],
  templateUrl: './faq-contact.component.html',
  styleUrl: './faq-contact.component.scss'
})
export class FAQContactComponent implements OnInit {
  public readonly WH_NUMBER = BUSINESS_NUMBER

  public readonly questions = (length: number, offset: number = 1): StaticData[] => Array.from({ length }, (_, index) => ({
    title: "PUBLIC.FAQ.CONTENT.QUESTION_" + (index + offset),
    data1: "PUBLIC.FAQ.CONTENT.ANSWER_" + (index + offset)
  }))

  public readonly faqContent = [
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_1',
      list: this.questions(3)
    },
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_2',
      list: this.questions(4, 4)
    },
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_3',
      list: this.questions(2, 8)
    },
  ]

  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: 'contact',
      page: 'CONTACT',
    })
  }
}
