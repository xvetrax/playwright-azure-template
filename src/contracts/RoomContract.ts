import { z } from 'zod';

export const RoomFeatureSchema = z.string().min(1);

export const RoomSchema = z.object({
  roomid: z.number().int().positive(),
  roomName: z.string().min(1),
  type: z.string().min(1),
  accessible: z.boolean(),
  image: z.string().min(1),
  description: z.string().min(1),
  features: z.array(RoomFeatureSchema),
  roomPrice: z.number().nonnegative(),
});

export const RoomsListSchema = z.object({
  rooms: z.array(RoomSchema),
});

export const CreateRoomSchema = RoomSchema.omit({ roomid: true });

export const ActionSuccessSchema = z.object({
  success: z.boolean(),
});

export type Room = z.infer<typeof RoomSchema>;
export type RoomsList = z.infer<typeof RoomsListSchema>;
export type CreateRoomRequest = z.infer<typeof CreateRoomSchema>;
export type ActionSuccessResponse = z.infer<typeof ActionSuccessSchema>;
