import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MAT_FORMS_MODULES } from '../../shared/material-modules';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ...MAT_FORMS_MODULES, FormControlComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
    this.authService.login(email as string, password as string).subscribe(({ email }) => {
      if (email) {
        this.router.navigate(['/admin']);
      } else {
        alert('Contraseña incorrecta');
      }
    })
  }
}