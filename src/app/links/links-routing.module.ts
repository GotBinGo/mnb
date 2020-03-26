import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinksComponent } from './links/links.component';

const routes: Routes = [{ path: '', component: LinksComponent, data: { title: 'Linkgyűjtemény' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LinksRoutingModule {}
