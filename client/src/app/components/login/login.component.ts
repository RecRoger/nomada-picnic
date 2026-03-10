import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { FormControlComponent } from '@components/form-control/form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '@services/notification.service';
import { AlertTypes } from '@shared/enums';
import { MAT_FORMS_MODULES } from '@constants/material-modules';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, ...MAT_FORMS_MODULES, FormControlComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  protected readonly fb = inject(FormBuilder)

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
  private readonly notificationService: NotificationService = inject(NotificationService)

  private readonly authService = inject(AuthService)

  private readonly router = inject(Router)

  public onSubmit(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email as string, password as string).subscribe((resp) => {
      const { email } = (resp?.data || {})
      if (email) {
        this.router.navigate(['/admin']);
      } else {
        this.notificationService.openNotification({ message: "LOGIN.INVLID_ERROR" }, AlertTypes.ERROR)
      }
    })
  }
}