import { Routes } from '@angular/router';
import { ClientLoginPageComponent } from './pages/client-login-page.component';
import { ClientRegisterPageComponent } from './pages/client-register-page.component';
import { ClientVerifyCodePageComponent } from './pages/client-verify-code-page.component';

export const LOGIN_CLIENTS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: ClientLoginPageComponent
    },
    {
        path: 'register',
        component: ClientRegisterPageComponent
    },
    {
        path: 'verify',
        component: ClientVerifyCodePageComponent
    }
];
