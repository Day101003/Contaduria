import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientAuthStore } from '../store/client-auth.store';

@Component({
    selector: 'app-client-verify-code-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './client-verify-code-page.component.html',
    styleUrls: ['./client-verify-code-page.component.css']
})
export class ClientVerifyCodePageComponent implements OnInit, OnDestroy {
    verificationCode: string = '';
    showPassword: boolean = false;
    codeDigits: string[] = ['', '', '', '', '', ''];

    constructor(public authStore: ClientAuthStore) {}

    ngOnInit(): void {
       
        if (!this.authStore.pendingVerificationEmail()) {
            
        }
    }

    ngOnDestroy(): void {
        
    }

    
    onCodeChange(index: number, event: any): void {
        const value = event.target.value;
        
        if (value.length > 1) {
      
            const digits = value.split('');
            for (let i = 0; i < Math.min(digits.length, this.codeDigits.length - index); i++) {
                this.codeDigits[index + i] = digits[i];
            }
        
            const lastFilledIndex = Math.min(index + digits.length - 1, this.codeDigits.length - 1);
            setTimeout(() => {
                const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
                if (inputs[lastFilledIndex + 1]) {
                    inputs[lastFilledIndex + 1].focus();
                }
            }, 0);
        } else {
            this.codeDigits[index] = value;
            
           
            if (value && index < this.codeDigits.length - 1) {
                setTimeout(() => {
                    const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
                    inputs[index + 1].focus();
                }, 50);
            }
        }

        
        this.verificationCode = this.codeDigits.join('');
    }

    onKeyDown(index: number, event: KeyboardEvent): void {
      
        if (!(event.key === 'Backspace' || event.key === 'Delete' || /[0-9]/.test(event.key))) {
            event.preventDefault();
        }

     
        if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
            this.codeDigits[index - 1] = '';
            setTimeout(() => {
                const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
                inputs[index - 1].focus();
            }, 50);
        }
    }

    onSubmit(): void {
        const code = this.codeDigits.join('');
        
        if (code.length !== 6) {
            this.authStore.setError('Por favor ingresa los 6 dígitos del código.');
            return;
        }

        this.authStore.verifyCode(code);
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    get email(): string {
        return this.authStore.pendingVerificationEmail() || '';
    }

    get loading(): boolean {
        return this.authStore.loading();
    }

    get error(): string | null {
        return this.authStore.error();
    }

    clearError(): void {
        this.authStore.clearError();
    }
}
