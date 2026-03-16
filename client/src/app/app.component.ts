import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "@components/header/header.component";
import { MapsService } from '@services/maps.service';
import { WaButtonComponent } from '@components/wa-button/wa-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, WaButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private mapsService = inject(MapsService)

  constructor(private translate: TranslateService) {
    this.mapsService.load().catch(err => console.error('Error al cargar Google Maps', err))
    this.translate.use('es');
  }
}
