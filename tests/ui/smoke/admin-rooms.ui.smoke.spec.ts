import { AllureReporter } from '@helper/reporting/AllureReporter';
import { uiTest as test } from '@fixtures/UiFixture';

test.describe('Restful Booker Platform - Admin UI Smoke', () => {
  test(
    'TC-UI-SMK-002: Admin can log in and view room management',
    { tag: ['@smoke', '@ui', '@P1'] },
    async ({ adminLoginPage, adminRoomsPage }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'UI Smoke',
        story: 'Admin can access the room management dashboard',
        severity: 'critical',
        tags: ['ui', 'smoke', 'admin'],
      });

      await adminLoginPage.navigate();
      await adminLoginPage.verifyPageLoaded();
      await adminLoginPage.verifyLoginFormVisible();
      await adminLoginPage.loginAsAdmin();

      await adminRoomsPage.verifyPageLoaded();
      await adminRoomsPage.verifyRoomManagementVisible();
      await adminRoomsPage.verifyRoomInventoryIsPopulated();
      await adminRoomsPage.verifyRoomNamesVisible(['101']);
    }
  );
});
