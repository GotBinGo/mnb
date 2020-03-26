import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketsComponent
  },
  {
    path: 'add',
    component: EditTicketComponent
  },
  {
    path: 'edit/:ticketId',
    component: EditTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TicketsRoutingModule {}
