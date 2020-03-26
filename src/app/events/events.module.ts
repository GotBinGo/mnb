import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { EventsRoutingModule } from './events-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [EventsComponent],
  imports: [CommonModule, EventsRoutingModule, SharedModule, ReactiveFormsModule, MatDatepickerModule, NgSelectModule]
})
export class EventsModule {}
