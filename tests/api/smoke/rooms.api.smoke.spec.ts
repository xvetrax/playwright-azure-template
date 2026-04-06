import { AllureReporter } from '@helper/reporting/AllureReporter';
import { apiTest as test } from '@fixtures/ApiFixture';

test.describe('Restful Booker Platform - API Room Smoke', () => {
  test(
    'TC-API-SMK-002: Public room catalog returns seeded rooms',
    { tag: ['@smoke', '@api', '@P1'] },
    async ({ roomService, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'API Smoke',
        story: 'Public room catalog is available without authentication',
        severity: 'critical',
        tags: ['api', 'smoke', 'rooms'],
      });

      const response = await roomService.getRooms();

      await assertUtils.assertGreaterThan(
        response.rooms.length,
        0,
        'Public room catalog should return at least one room'
      );
      await assertUtils.assertTrue(
        response.rooms.some((room) => room.roomName === '101'),
        'Seeded room 101 should be present in the public room catalog'
      );
    }
  );
});
