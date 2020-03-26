import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets/tickets.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { TicketsRoutingModule } from './tickets-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material';

@NgModule({
  declarations: [TicketsComponent, EditTicketComponent],
  imports: [CommonModule, TicketsRoutingModule, SharedModule, ReactiveFormsModule, NgSelectModule, MatSlideToggleModule]
})
export class TicketsModule {}
