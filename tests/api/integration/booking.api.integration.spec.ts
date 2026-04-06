import { AllureReporter } from '@helper/reporting/AllureReporter';
import { apiTest as test } from '@fixtures/ApiFixture';
import { BookingFactory } from '@test-data/BookingFactory';

test.describe('Restful Booker Platform - API Booking Integration', () => {
  test(
    'TC-API-INT-001: Booking can be created and is visible in the secured summary',
    { tag: ['@integration', '@api', '@P1'] },
    async ({ bookingService, authenticatedBookingService, registry, assertUtils }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'API Integration',
        story: 'A public booking becomes visible in the authenticated booking summary',
        severity: 'critical',
        tags: ['api', 'integration', 'booking'],
      });

      const bookingPayload = BookingFactory.create();
      const booking = await bookingService.createBooking(bookingPayload);

      registry.track('booking', booking.bookingid);

      await assertUtils.assertEquals(
        booking.roomid,
        bookingPayload.roomid,
        'Created booking room id should match the request payload'
      );
      await assertUtils.assertEquals(
        booking.firstname,
        bookingPayload.firstname,
        'Created booking first name should match the request payload'
      );

      const summary = await authenticatedBookingService.getBookingSummary(booking.roomid);

      await assertUtils.assertTrue(
        summary.bookings.some(
          (item) =>
            item.bookingDates.checkin === bookingPayload.bookingdates.checkin &&
            item.bookingDates.checkout === bookingPayload.bookingdates.checkout
        ),
        'Created booking should be visible in the authenticated booking summary'
      );
    }
  );
});
