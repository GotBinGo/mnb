import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private roomChange = new BehaviorSubject<string>(undefined);

  constructor() {}

  updateRoom(roomName?: string) {
    this.roomChange.next(roomName);
  }

  getRoomChangeObservable() {
    return this.roomChange.asObservable();
  }

  getSelectedRoomName() {
    return this.roomChange.value;
  }
}
