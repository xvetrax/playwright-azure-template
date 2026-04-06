import { AllureReporter } from '@helper/reporting/AllureReporter';
import { uiTest as test } from '@fixtures/UiFixture';

test.describe('Restful Booker Platform - UI Smoke', () => {
  test(
    'TC-UI-SMK-001: Visitor can open the booking home page and view the room catalog',
    { tag: ['@smoke', '@ui', '@P1'] },
    async ({ homePage }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'UI Smoke',
        story: 'Visitor can open the public booking home page',
        severity: 'critical',
        tags: ['ui', 'smoke', 'restful-booker-platform'],
      });

      await homePage.navigate();
      await homePage.verifyPageLoaded();
      await homePage.verifyRoomCatalogVisible();
      await homePage.verifyRoomCardsArePopulated();
    }
  );
});
