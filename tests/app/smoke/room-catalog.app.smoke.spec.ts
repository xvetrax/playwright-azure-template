import { AllureReporter } from '@helper/reporting/AllureReporter';
import { appTest as test } from '@fixtures/AppFixture';

test.describe('Restful Booker Platform - Hybrid UI + API Flows', () => {
  test(
    'TC-APP-SMK-001: Public room API and public UI catalog are both available',
    { tag: ['@smoke', '@app', '@integration', '@P1'] },
    async ({ roomService, homePage, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'Hybrid App Flow',
        story: 'A visitor can access both the public room API and the public room catalog UI',
        severity: 'critical',
        tags: ['app', 'hybrid', 'room-catalog'],
      });

      const rooms = await roomService.getRooms();
      await assertUtils.assertGreaterThan(
        rooms.rooms.length,
        0,
        'Public room API should return at least one room'
      );

      await homePage.navigate();
      await homePage.verifyPageLoaded();
      await homePage.verifyRoomCatalogVisible();
      await homePage.verifyRoomCardsArePopulated();
    }
  );
});
