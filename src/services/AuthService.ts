import { ApiClient } from '@core/ApiClient';
import { authManager } from '@core/AuthManager';
import {
  HealthResponse,
  HealthResponseSchema,
  LoginResponse,
  LoginResponseSchema,
} from '@contracts/AuthContract';

export class AuthService {
  constructor(private readonly api: ApiClient) {}

  async login(): Promise<string> {
    return authManager.login(this.api);
  }

  async loginAndGetToken(): Promise<LoginResponse> {
    const token = await this.login();
    return LoginResponseSchema.parse({ token });
  }

  async getHealth(): Promise<HealthResponse> {
    const endpoint = '/room';
    const response = await this.api.get(endpoint, { headers: { Accept: 'application/json' } });

    return HealthResponseSchema.parse({
      endpoint,
      statusCode: response.status(),
      ok: response.ok(),
      checkedAt: new Date().toISOString(),
    });
  }

  logout(): void {
    authManager.clearToken();
  }

  isAuthenticated(): boolean {
    return authManager.getToken() !== null;
  }
}
