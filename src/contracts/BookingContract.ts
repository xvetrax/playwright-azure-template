import { z } from 'zod';

export const BookingDatesSchema = z.object({
  checkin: z.string().min(1),
  checkout: z.string().min(1),
});

export const CreateBookingSchema = z.object({
  roomid: z.number().int().positive(),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  depositpaid: z.boolean(),
  email: z.string().email(),
  phone: z.string().min(11).max(21),
  bookingdates: BookingDatesSchema,
});

export const BookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  roomid: z.number().int().positive(),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
});

export const BookingDetailSchema = z.object({
  bookingid: z.number().int().positive().optional(),
  roomid: z.number().int().positive().optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  depositpaid: z.boolean().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(11).max(21).optional(),
  bookingdates: BookingDatesSchema,
});

export const BookingSummaryItemSchema = z.object({
  bookingDates: BookingDatesSchema,
});

export const BookingSummarySchema = z.object({
  bookings: z.array(BookingSummaryItemSchema),
});

export const ActionSuccessSchema = z.object({
  success: z.boolean(),
});

export type BookingDates = z.infer<typeof BookingDatesSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
export type BookingDetail = z.infer<typeof BookingDetailSchema>;
export type BookingSummaryItem = z.infer<typeof BookingSummaryItemSchema>;
export type BookingSummary = z.infer<typeof BookingSummarySchema>;
export type BookingActionSuccess = z.infer<typeof ActionSuccessSchema>;
