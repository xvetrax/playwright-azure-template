import { CreateBookingRequest } from '@contracts/BookingContract';

export class BookingFactory {
  static create(overrides?: Partial<CreateBookingRequest>): CreateBookingRequest {
    const checkinDate = new Date();
    const startOffsetDays = 14 + Math.floor(Math.random() * 45);
    const stayLengthDays = 1 + Math.floor(Math.random() * 3);

    checkinDate.setUTCDate(checkinDate.getUTCDate() + startOffsetDays);

    const checkoutDate = new Date(checkinDate);
    checkoutDate.setUTCDate(checkoutDate.getUTCDate() + stayLengthDays);

    const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

    return {
      roomid: 1 + Math.floor(Math.random() * 3),
      firstname: 'Rajesh',
      lastname: 'Yemul',
      depositpaid: true,
      email: `rajesh.${Date.now()}@example.com`,
      phone: '+919999999999',
      bookingdates: {
        checkin: formatDate(checkinDate),
        checkout: formatDate(checkoutDate),
      },
      ...overrides,
    };
  }
}
