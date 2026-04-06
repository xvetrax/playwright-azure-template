import { Page, test } from '@playwright/test';
import { Logger } from '@helper/logger/Logger';
import { PageActions } from './PageActions';

export class UIActions {
  constructor(private readonly pageActions: PageActions) {}

  private get page(): Page {
    return this.pageActions.getPage();
  }

  public async goto(url: string, description: string): Promise<void> {
    await test.step(`Navigate to ${description}`, async () => {
      await this.pageActions.gotoURL(url, description);
    });
  }

  public async click(selector: string, description?: string): Promise<void> {
    const stepName = description ?? `Click ${selector}`;
    await test.step(stepName, async () => {
      Logger.info(stepName);
      await this.page.locator(selector).click();
    });
  }

  public async fill(selector: string, value: string, description?: string): Promise<void> {
    const stepName = description ?? `Fill ${selector}`;
    await test.step(stepName, async () => {
      Logger.info(`${stepName} with "${value}"`);
      await this.page.locator(selector).fill(value);
    });
  }

  public async waitForVisible(selector: string, timeout: number = 30000): Promise<void> {
    await test.step(`Wait for ${selector} to be visible`, async () => {
      Logger.info(`Waiting for ${selector} to be visible`);
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    });
  }

  public async isElementVisible(selector: string): Promise<boolean> {
    return await test.step(`Check ${selector} visibility`, async () => {
      const isVisible = await this.page.locator(selector).isVisible();
      Logger.info(`Element ${selector} visibility: ${isVisible}`);
      return isVisible;
    });
  }

  public async text(selector: string): Promise<string> {
    return await test.step(`Read text from ${selector}`, async () => {
      const content = await this.page.locator(selector).textContent();
      const text = content?.trim() ?? '';
      Logger.info(`Text from ${selector}: ${text}`);
      return text;
    });
  }

  public async selectByValue(selector: string, value: string): Promise<void> {
    await test.step(`Select ${value} in ${selector}`, async () => {
      Logger.info(`Selecting option ${value} in ${selector}`);
      await this.page.locator(selector).selectOption(value);
    });
  }

  public async pressKey(key: string): Promise<void> {
    await test.step(`Press key ${key}`, async () => {
      await this.page.keyboard.press(key);
    });
  }

  public async reload(): Promise<void> {
    await test.step('Reload page', async () => {
      await this.pageActions.reloadPage();
    });
  }
}
