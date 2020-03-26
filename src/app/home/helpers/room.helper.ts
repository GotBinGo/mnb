import { RoomScheduleDto } from '@app/api/app.generated';
import { getIrodaCode } from '@app/shared/three-view/iroda-labels';

export class RoomHelper {
  static parseRoomScheduleInfo(roomSchedule: RoomScheduleDto) {
    // ensure no finished reservations
    roomSchedule.schedules = roomSchedule.schedules.filter(sched => sched.end >= new Date());

    return {
      schedules: roomSchedule.schedules,
      id: getIrodaCode(roomSchedule.roomEmail.split('@')[0]),
      free: roomSchedule.schedules.length === 0 || roomSchedule.schedules[0].start > new Date()
    };
  }
}
