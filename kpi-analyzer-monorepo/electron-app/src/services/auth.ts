const API_URL = import.meta.env.VITE_API_URL || '/api';

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface User {
    username: string;
    email: string | null;
    is_admin: boolean;
}

class AuthService {
    private tokenKey = 'kpi_auth_token';

    async login(username: string, password: string): Promise<boolean> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }

        const data: LoginResponse = await response.json();
        localStorage.setItem(this.tokenKey, data.access_token);
        return true;
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        window.location.href = '/login';
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async getCurrentUser(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null;

        const response = await fetch(`${API_URL}/me`, {
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            this.logout();
            return null;
        }

        return response.json();
    }
}

export const authService = new AuthService();
