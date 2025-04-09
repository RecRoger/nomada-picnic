import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { MAT_FORMS_MODULES } from '@shared/material-modules';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '@services/notification.service';
import { ALERT_TYPES } from '@enums/alert-types.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, ...MAT_FORMS_MODULES, FormControlComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly notificationService: NotificationService = inject(NotificationService)

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl
  }

  public get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  public onSubmit(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email as string, password as string).subscribe((resp) => {
      const { email } = (resp || {})
      if (email) {
        this.router.navigate(['/admin']);
      } else {
        this.notificationService.openNotification({ message: "LOGIN.INVLID_ERROR" }, ALERT_TYPES.ERROR)
      }
    })
  }
}