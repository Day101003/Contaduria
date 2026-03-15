import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientAuthStore } from '../store/client-auth.store';
import { CreateClientDto } from '../models/auth';

@Component({
    selector: 'app-client-register-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './client-register-page.component.html',
    styleUrls: ['./client-register-page.component.css']
})
export class ClientRegisterPageComponent {
    clientData: CreateClientDto = {
        firstName: '',
        lastName: '',
        profilePhoto: '',
        phone: '',
        idCard: '',
        email: '',
        address: '',
        password: ''
    };

    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;

    constructor(public authStore: ClientAuthStore) { }

    onSubmit(): void {
        if (this.isFormValid()) {
            this.authStore.register(this.clientData);
        }
    }

    isFormValid(): boolean {
        return !!(
            this.clientData.firstName &&
            this.clientData.lastName &&
            this.clientData.phone &&
            this.clientData.idCard &&
            this.clientData.email &&
            this.clientData.address &&
            this.clientData.password &&
            this.clientData.password === this.confirmPassword
        );
    }

    passwordsMatch(): boolean {
        return this.clientData.password === this.confirmPassword;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}
