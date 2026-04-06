import { configManager } from '@config/ConfigManager';
import { LoginRequest } from '@contracts/AuthContract';

export class AuthFactory {
  static validCredentials(): LoginRequest {
    return {
      username: configManager.getUsername(),
      password: configManager.getPassword(),
    };
  }

  static invalidCredentials(): LoginRequest {
    return {
      username: 'invalid-admin-user',
      password: 'invalid-password',
    };
  }
}
