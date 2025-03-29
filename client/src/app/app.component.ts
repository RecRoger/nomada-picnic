import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  providers: [AuthService, TranslateStore]
})
export class AppComponent {
  title = 'Cliente'

  constructor(private translate: TranslateService) {
    console.log('it strart')
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}
