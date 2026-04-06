import { AllureReporter } from '@helper/reporting/AllureReporter';
import { appTest as test } from '@fixtures/AppFixture';

test.describe('Restful Booker Platform - Hybrid Public Catalog Flows', () => {
  test(
    'TC-APP-INT-002: Public room API sample matches the public UI catalog',
    { tag: ['@integration', '@app', '@P1'] },
    async ({ roomService, homePage, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'Hybrid App Flow',
        story: 'The public API room sample matches the visible public room catalog UI',
        severity: 'critical',
        tags: ['app', 'hybrid', 'room-catalog'],
      });

      const rooms = await roomService.getRooms();

      await assertUtils.assertGreaterThanOrEqual(
        rooms.rooms.length,
        3,
        'Public room API should return at least three rooms for UI comparison'
      );

      await homePage.navigate();
      await homePage.verifyPageLoaded();
      await homePage.verifyPublicCatalogMatchesRooms(rooms.rooms);
    }
  );
});
