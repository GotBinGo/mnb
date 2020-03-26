import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignGuidelineComponent } from './design-guideline/design-guideline.component';
import { Routes, RouterModule } from '@angular/router';
import { MatrixTableComponent } from './matrix-table/matrix-table.component';
import { ListTableComponent } from './list-table/list-table.component';
import { MegrendelesDetailsComponent } from './megrendeles-details/megrendeles-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableModule, MatSortModule, MatDatepickerModule, MatPaginatorModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { Roles } from '@app/core/models/roles';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DesignGuidelineComponent,
    data: { title: 'Guideline' },
    children: [
      { path: '', redirectTo: 'matrix' },
      { path: 'matrix', component: MatrixTableComponent, data: { allowedRoles: [Roles.Administrator] } },
      { path: 'list', component: ListTableComponent },
      { path: 'details', component: MegrendelesDetailsComponent }
    ]
  }
];

@NgModule({
  declarations: [DesignGuidelineComponent, MatrixTableComponent, ListTableComponent, MegrendelesDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    NgSelectModule,
    MatTooltipModule
  ]
})
export class DesignGuidelineModule {}
