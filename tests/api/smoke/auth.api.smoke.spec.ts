import { AllureReporter } from '@helper/reporting/AllureReporter';
import { apiTest as test } from '@fixtures/ApiFixture';

test.describe('Restful Booker Platform - API Authentication Smoke', () => {
  test(
    'TC-API-SMK-001: Admin login returns a token',
    { tag: ['@smoke', '@api', '@P1'] },
    async ({ authService, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'API Smoke',
        story: 'Admin authentication returns a reusable token',
        severity: 'critical',
        tags: ['api', 'smoke', 'auth'],
      });

      const loginResponse = await authService.loginAndGetToken();

      await assertUtils.assertTrue(
        Boolean(loginResponse.token),
        'Admin login should return a non-empty token'
      );
      await assertUtils.assertGreaterThan(
        loginResponse.token.length,
        5,
        'Admin login token length should be greater than five characters'
      );
    }
  );
});
