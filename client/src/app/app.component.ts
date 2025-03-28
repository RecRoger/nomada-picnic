import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  providers: [AuthService]
})
export class AppComponent {
  title = 'Cliente'

  constructor() {
    console.log('it strart')
  }
}
