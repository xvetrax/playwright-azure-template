import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { ConfigManager } from './src/config/ConfigManager';
import { PathConstants } from './src/support/constants/PathConstants';
import { SetupConstants } from './src/support/constants/SetupConstants';

dotenv.config();

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const REPORT_ROOT = process.env.REPORT_ROOT || path.join(process.cwd(), 'reports', timestamp);
const isCI = ConfigManager.isCI();
const selectedBrowser = ConfigManager.getBrowser();
const isOrderedDiscovery = process.env.ORDERED_DISCOVERY === 'true';
const isOrderedRun = process.env.ORDERED_RUN === 'true';

const browserDeviceMap = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
} as const;

class PlaywrightConfigHelper {
  private static parseNumber(value: string | undefined, fallback: number): number {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : fallback;
  }

  private static getEnvironmentInfo(): Record<string, string> {
    return {
      Framework: SetupConstants.FRAMEWORK_TITLE,
      Environment: ConfigManager.getEnvironment(),
      Browser: selectedBrowser,
      UI_Base_URL: ConfigManager.getUiBaseUrl(),
      API_Base_URL: ConfigManager.getApiBaseUrl(),
      OS_Platform: os.platform(),
      OS_Release: os.release(),
      Node_Version: process.version,
      Report_Generation_Time: new Date().toLocaleString(),
    };
  }

  static getConfiguredWorkers(): number | undefined {
    if (process.env.WORKERS) {
      return this.parseNumber(process.env.WORKERS, 1);
    }

    if (isCI) {
      return this.parseNumber(process.env.CI_WORKERS, 1);
    }

    return undefined;
  }

  static getRetries(): number {
    return this.parseNumber(process.env.RETRIES, isCI ? 1 : 0);
  }

  static getTestTimeout(): number {
    return this.parseNumber(process.env.TEST_TIMEOUT, 60_000);
  }

  static getOutputDirectory(): string {
    if (isOrderedRun) {
      return path.join(
        REPORT_ROOT,
        PathConstants.FOLDER_ARTIFACTS,
        process.env.ORDERED_BUCKET_NAME || 'ordered-run'
      );
    }

    return path.join(REPORT_ROOT, PathConstants.FOLDER_ARTIFACTS);
  }

  static getDefaultReporters(): ReporterDescription[] {
    return [
      ['list'],
      [
        'html',
        {
          open: SetupConstants.NEVER,
          title: SetupConstants.HTML_REPORT_TITLE,
          outputFolder: path.join(REPORT_ROOT, PathConstants.HTML_REPORTS_PATH),
          noSnippets: true,
        },
      ],
      ['junit', { outputFile: path.join(REPORT_ROOT, PathConstants.JUNIT_REPORTS_PATH) }],
      ['json', { outputFile: path.join(REPORT_ROOT, PathConstants.JSON_REPORTS_PATH) }],
      [
        'allure-playwright',
        {
          detail: true,
          resultsDir: path.join(REPORT_ROOT, PathConstants.ALLURE_REPORTS_PATH),
          suiteTitle: true,
          environmentInfo: this.getEnvironmentInfo(),
        },
      ],
    ];
  }

  static getOrderedDiscoveryReporters(): ReporterDescription[] {
    return [
      [
        'json',
        {
          outputFile:
            process.env.ORDERED_DISCOVERY_OUTPUT_FILE ||
            path.join(REPORT_ROOT, PathConstants.ORDERED_RESULTS_PATH, 'discovery.json'),
        },
      ],
    ];
  }

  static getOrderedRunReporters(): ReporterDescription[] {
    return [
      ['list'],
      [
        'blob',
        {
          outputDir:
            process.env.ORDERED_BLOB_OUTPUT_DIR ||
            path.join(REPORT_ROOT, PathConstants.BLOB_REPORTS_PATH),
          fileName: process.env.ORDERED_BLOB_FILE_NAME || 'ordered-run.zip',
        },
      ],
      [
        'json',
        {
          outputFile:
            process.env.ORDERED_BUCKET_JSON_OUTPUT_FILE ||
            path.join(REPORT_ROOT, PathConstants.ORDERED_RESULTS_PATH, 'ordered-run.json'),
        },
      ],
      [
        'allure-playwright',
        {
          detail: true,
          resultsDir: path.join(REPORT_ROOT, PathConstants.ALLURE_REPORTS_PATH),
          suiteTitle: true,
          environmentInfo: {
            ...this.getEnvironmentInfo(),
            Ordered_Bucket: process.env.ORDERED_BUCKET_NAME || 'unknown',
          },
        },
      ],
    ];
  }

  static resolveReporters(): ReporterDescription[] {
    if (isOrderedDiscovery) {
      return this.getOrderedDiscoveryReporters();
    }

    if (isOrderedRun) {
      return this.getOrderedRunReporters();
    }

    return this.getDefaultReporters();
  }
}

process.env.REPORT_ROOT = REPORT_ROOT;

export default defineConfig({
  testDir: './tests',
  timeout: PlaywrightConfigHelper.getTestTimeout(),
  fullyParallel: true,
  forbidOnly: isCI,
  retries: PlaywrightConfigHelper.getRetries(),
  workers: PlaywrightConfigHelper.getConfiguredWorkers(),
  outputDir: PlaywrightConfigHelper.getOutputDirectory(),
  reporter: PlaywrightConfigHelper.resolveReporters(),
  globalSetup: './src/config/global-setup',
  globalTeardown: './src/config/global-teardown',
  use: {
    baseURL: ConfigManager.getUiBaseUrl(),
    headless: ConfigManager.isHeadless(),
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: SetupConstants.ONLY_ON_FAILURE,
    video: SetupConstants.RETAIN_ON_FAILURE,
    trace: SetupConstants.RETAIN_ON_FAILURE,
  },
  projects: [
    {
      name: `framework-${selectedBrowser}`,
      use: {
        ...browserDeviceMap[selectedBrowser],
        browserName: selectedBrowser,
      },
    },
  ],
});
