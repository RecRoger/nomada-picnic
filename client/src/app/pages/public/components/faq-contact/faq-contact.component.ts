import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { StaticData } from '@models/static-data';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsService } from '@services/analytics.service';
import { SeoService } from '@services/seo.service';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-faq-contact',
  imports: [TranslatePipe, MatExpansionModule],
  templateUrl: './faq-contact.component.html',
  styleUrl: './faq-contact.component.scss'
})
export class FAQContactComponent implements OnInit {
  public readonly questions = (length: number, offset: number = 1): StaticData[] => Array.from({ length }, (_, index) => ({
    title: "PUBLIC.FAQ.CONTENT.QUESTION_" + (index + offset),
    data: "PUBLIC.FAQ.CONTENT.ANSWER_" + (index + offset)
  }))

  public readonly faqContent = [
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_1',
      list: this.questions(4)
    },
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_2',
      list: this.questions(5, 5)
    },
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_3',
      list: this.questions(3, 10)
    },
    {
      title: 'PUBLIC.FAQ.CONTENT.TITLE_4',
      list: this.questions(6, 13)
    },
  ]

  private seoService = inject(SeoService);

  private readonly analyticsService = inject(AnalyticsService)

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: 'contact',
      page: 'CONTACT',
    })
  }

  public contactWhatsapp(): void {
    this.analyticsService.logEvent('click_contact', {
      channel: 'whatsapp',
      origin: 'faq_page'
    })
    let message = `¡Hola! Me gustaria tener mas informacion acerca de los picnics`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
