import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { RoomDataComponent } from './room-data/room-data.component';
import { ReserveRoomComponent } from './reserve-room/reserve-room.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { HomePopupComponent } from './home-popup/home-popup.component';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, SharedModule, FormsModule, MatDatepickerModule, NgSelectModule],
  declarations: [HomeComponent, RoomDataComponent, ReserveRoomComponent, HomePopupComponent],
  entryComponents: [ReserveRoomComponent]
})
export class HomeModule {}
