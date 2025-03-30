import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsService } from './services/maps.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleMapsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    AuthService,
    MapsService,
    TranslateStore,
  ]
})
export class AppComponent {
  constructor(private translate: TranslateService, private mapsService: MapsService) {
    this.mapsService.load()
      .then(() => console.log('Google Maps cargado'))
      .catch(err => console.error('Error al cargar Google Maps', err))
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}

