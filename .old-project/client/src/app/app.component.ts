import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '@services/auth.service';
import { MapsService } from '@services/maps.service';
import { NotificationService } from '@services/notification.service';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // GoogleMapsModule,
    // RouterOutlet,
    // HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    // AuthService,
    // MapsService,
    // TranslateStore,
    // NotificationService,
  ]
})
export class AppComponent {
  // constructor(private translate: TranslateService, private mapsService: MapsService) {
  //   this.mapsService.load().catch(err => console.error('Error al cargar Google Maps', err))
  //   this.translate.addLangs(['en', 'es']);
  //   this.translate.setDefaultLang('es');
  //   this.translate.use('es');
  // }
}

