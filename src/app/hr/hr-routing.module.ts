import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';

const routes: Routes = [
  {
    path: 'newsletter',
    component: NewsletterComponent,
    canActivate: [AuthenticationGuard],
    data: { title: 'Hírlevél' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HrRoutingModule {}
