import { CreateRoomRequest } from '@contracts/RoomContract';

export class RoomFactory {
  static create(overrides?: Partial<CreateRoomRequest>): CreateRoomRequest {
    const uniqueSuffix = `${Date.now()}`;

    return {
      roomName: `PWROOM${uniqueSuffix}`,
      type: 'Suite',
      accessible: true,
      image:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      description: 'Automation-created room used for validating hybrid UI and API flows.',
      features: ['WiFi', 'TV', 'Safe'],
      roomPrice: 245,
      ...overrides,
    };
  }
}
