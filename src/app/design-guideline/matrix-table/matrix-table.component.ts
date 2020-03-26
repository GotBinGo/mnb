import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { orderBy } from 'lodash';

const DATA: any[] = [
  { modelName: 'Cicás', gender: 'Női', sizeS: true, sizeM: true, sizeL: false },
  { modelName: 'Basic', gender: 'Unisex', sizeS: true, sizeM: true, sizeL: false },
  { modelName: 'Ultrabrutál', gender: 'Férfi', sizeS: false, sizeM: true, sizeL: true }
];

@Component({
  selector: 'app-matrix-table',
  templateUrl: './matrix-table.component.html',
  styleUrls: ['./matrix-table.component.scss']
})
export class MatrixTableComponent implements OnInit {
  sizes = [{ label: 'S', objectKey: 'sizeS' }, { label: 'M', objectKey: 'sizeM' }, { label: 'L', objectKey: 'sizeL' }];
  displayedColumns: string[] = ['modelName', 'gender', ...this.sizes.map(x => x.objectKey), 'controls'];
  dataSource = DATA;

  constructor() {}

  ngOnInit() {}

  onSort(sort: Sort) {
    if (sort.direction) {
      this.dataSource = orderBy(DATA, [sort.active], [sort.direction as ('asc' | 'desc')]);
    } else {
      this.dataSource = DATA;
    }
  }
}
