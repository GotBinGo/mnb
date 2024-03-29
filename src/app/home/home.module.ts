import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { RoomDataComponent } from './room-data/room-data.component';
import { ReserveRoomComponent } from './reserve-room/reserve-room.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatTabsModule, MatIconModule, MatCardModule, MatButtonModule } from '@angular/material';
import { MapComponent } from './map/map.component';
import { MedalsComponent } from './medals/medals.component';
import { DivTextComponent } from './div-text/div-text.component';
import { RadialProgressComponent } from './radial-progress/radial-progress.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    NgSelectModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    SortablejsModule
  ],
  declarations: [
    HomeComponent,
    RoomDataComponent,
    ReserveRoomComponent,
    MapComponent,
    MedalsComponent,
    DivTextComponent,
    RadialProgressComponent,
    ProfilComponent
  ],
  entryComponents: [ReserveRoomComponent]
})
export class HomeModule {}
