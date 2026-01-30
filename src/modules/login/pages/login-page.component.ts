import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../store/auth.store';
import { Login } from '../models/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  credentials: Login = {
    correo: '',
    contrasena: ''
  };

  showPassword = false;

  constructor(public authStore: AuthStore) {}

  onSubmit(): void {
    if (this.credentials.correo && this.credentials.contrasena) {
      this.authStore.login(this.credentials);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
