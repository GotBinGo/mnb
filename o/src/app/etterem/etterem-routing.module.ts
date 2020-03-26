import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtteremComponent } from './etterem/etterem.component';

const routes: Routes = [{ path: '', component: EtteremComponent, data: { title: 'Éttermek' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EtteremRoutingModule {}
