import { AllureReporter } from '@helper/reporting/AllureReporter';
import { apiTest as test } from '@fixtures/ApiFixture';

test.describe('Restful Booker Platform - API Health Smoke', () => {
  test(
    'TC-API-SMK-003: Public room endpoint health probe returns an OK result',
    { tag: ['@smoke', '@api', '@P1'] },
    async ({ authService, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'API Smoke',
        story: 'Framework health probes can validate the public room endpoint',
        severity: 'critical',
        tags: ['api', 'smoke', 'health'],
      });

      const health = await authService.getHealth();

      await assertUtils.assertEquals(
        health.endpoint,
        '/room',
        'Health probe should report the public room endpoint'
      );
      await assertUtils.assertEquals(
        health.statusCode,
        200,
        'Health probe should receive HTTP 200 from the public room endpoint'
      );
      await assertUtils.assertTrue(
        health.ok,
        'Health probe should report the public room endpoint as healthy'
      );
    }
  );
});
