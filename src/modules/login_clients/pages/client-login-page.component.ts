import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientAuthStore } from '../store/client-auth.store';
import { ClientLogin } from '../models/auth';

@Component({
    selector: 'app-client-login-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './client-login-page.component.html',
    styleUrls: ['./client-login-page.component.css']
})
export class ClientLoginPageComponent {
    credentials: ClientLogin = {
        email: '',
        password: ''
    };

    showPassword = false;

    constructor(public authStore: ClientAuthStore) { }

    onSubmit(): void {
        if (this.credentials.email && this.credentials.password) {
            this.authStore.login(this.credentials);
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
}
