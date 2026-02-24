import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private http = inject(HttpClient);
  private readonly WEB3FORMS_KEY = '1f4f00fc-1923-4fe4-b277-7f56bae56b23';

  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit(): void {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;
    this.submitSuccess = false;

    const formPayload = {
      access_key: this.WEB3FORMS_KEY,
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone || 'No proporcionado',
      subject: this.formData.subject || 'Contacto desde sitio web',
      message: this.formData.message,
    };

    this.http.post('https://api.web3forms.com/submit', formPayload)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.success) {
            this.submitSuccess = true;
            this.formData = {
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            };
            setTimeout(() => {
              this.submitSuccess = false;
            }, 5000);
          } else {
            this.submitError = true;
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.submitError = true;
        }
      });
  }
}
