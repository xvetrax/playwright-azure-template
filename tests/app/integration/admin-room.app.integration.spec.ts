import { AllureReporter } from '@helper/reporting/AllureReporter';
import { appTest as test } from '@fixtures/AppFixture';
import { RoomFactory } from '@test-data/RoomFactory';

test.describe('Restful Booker Platform - Hybrid Admin Room Flows', () => {
  test(
    'TC-APP-INT-001: Room created by API is visible in the admin rooms UI',
    { tag: ['@integration', '@app', '@P1'] },
    async ({
      authenticatedRoomService,
      roomService,
      registry,
      adminLoginPage,
      adminRoomsPage,
      assertUtils,
    }) => {
      await AllureReporter.attachDetails({
        epic: 'Unified Framework',
        feature: 'Hybrid App Flow',
        story: 'An API-created room becomes visible in the admin room management UI',
        severity: 'critical',
        tags: ['app', 'hybrid', 'admin-room'],
      });

      const roomPayload = RoomFactory.create();
      const createResponse = await authenticatedRoomService.createRoom(roomPayload);
      await assertUtils.assertTrue(
        createResponse.success,
        'Room creation response should indicate success'
      );

      const rooms = await roomService.getRooms();
      const createdRoom = rooms.rooms.find((room) => room.roomName === roomPayload.roomName);

      await assertUtils.assertDefined(
        createdRoom,
        'API-created room should be present in the room catalog response'
      );
      registry.track('room', createdRoom!.roomid);

      await adminLoginPage.navigate();
      await adminLoginPage.verifyLoginFormVisible();
      await adminLoginPage.loginAsAdmin();

      await adminRoomsPage.verifyPageLoaded();
      await adminRoomsPage.verifyRoomManagementVisible();
      await adminRoomsPage.verifyRoomVisible(roomPayload.roomName);
    }
  );
});
