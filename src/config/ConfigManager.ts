import dotenv from 'dotenv';
import { Browsers } from '@support/enums/config/Browsers';

dotenv.config();

export type Environment = 'dev' | 'qa' | 'stage' | 'prod' | 'local';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class ConfigManager {
  private static normalizeUrl(url: string): string {
    return url.replace(/\/+$/, '');
  }

  static getEnvironment(): Environment {
    const value = (process.env.ENVIRONMENT || process.env.TEST_ENV || 'qa').toLowerCase();
    if (['dev', 'qa', 'stage', 'prod', 'local'].includes(value)) {
      return value as Environment;
    }
    throw new Error(`Invalid ENVIRONMENT value: ${value}`);
  }

  getEnvironment(): Environment {
    return ConfigManager.getEnvironment();
  }

  static getUiBaseUrl(): string {
    const explicit = process.env.UI_BASE_URL || process.env.BASE_URL;
    if (explicit) {
      return this.normalizeUrl(explicit);
    }

    const defaults: Record<Environment, string> = {
      dev: 'https://automationintesting.online',
      qa: 'https://automationintesting.online',
      stage: 'https://automationintesting.online',
      prod: 'https://automationintesting.online',
      local: 'https://automationintesting.online',
    };

    return defaults[this.getEnvironment()];
  }

  getUiBaseUrl(): string {
    return ConfigManager.getUiBaseUrl();
  }

  static getApiBaseUrl(): string {
    const explicit = process.env.API_BASE_URL;
    if (explicit) {
      return this.normalizeUrl(explicit);
    }

    return `${this.getUiBaseUrl()}/api`;
  }

  getApiBaseUrl(): string {
    return ConfigManager.getApiBaseUrl();
  }

  static getApiRequestBaseUrl(): string {
    return `${this.getApiBaseUrl()}/`;
  }

  getApiRequestBaseUrl(): string {
    return ConfigManager.getApiRequestBaseUrl();
  }

  static getBrowser(): Browsers {
    const browser = process.env.BROWSER?.toLowerCase();
    switch (browser) {
      case Browsers.FIREFOX:
        return Browsers.FIREFOX;
      case Browsers.WEBKIT:
        return Browsers.WEBKIT;
      default:
        return Browsers.CHROMIUM;
    }
  }

  getBrowser(): Browsers {
    return ConfigManager.getBrowser();
  }

  static isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }

  isHeadless(): boolean {
    return ConfigManager.isHeadless();
  }

  static getTimeout(): number {
    return Number(process.env.API_TIMEOUT) || 30_000;
  }

  getTimeout(): number {
    return ConfigManager.getTimeout();
  }

  static getLogLevel(): LogLevel {
    const level = (process.env.LOG_LEVEL || 'info').toLowerCase();
    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      return level as LogLevel;
    }
    return 'info';
  }

  getLogLevel(): LogLevel {
    return ConfigManager.getLogLevel();
  }

  static isDebug(): boolean {
    return process.env.DEBUG === 'true';
  }

  isDebug(): boolean {
    return ConfigManager.isDebug();
  }

  static isCI(): boolean {
    return process.env.CI === 'true';
  }

  isCI(): boolean {
    return ConfigManager.isCI();
  }

  static getRetryCount(): number {
    return this.isCI() ? 2 : 0;
  }

  getRetryCount(): number {
    return ConfigManager.getRetryCount();
  }

  static getUsername(): string {
    return process.env.ADMIN_USERNAME || 'admin';
  }

  getUsername(): string {
    return ConfigManager.getUsername();
  }

  static getPassword(): string {
    return process.env.ADMIN_PASSWORD || 'password';
  }

  getPassword(): string {
    return ConfigManager.getPassword();
  }
}

export const configManager = new ConfigManager();
