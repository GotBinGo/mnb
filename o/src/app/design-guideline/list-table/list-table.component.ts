import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { EyewearDataSource } from '../../shared/eyewear-data-source';
import { of } from 'rxjs';
import { MatPaginator, MatSort } from '@angular/material';
import { PagingResult } from '../../shared/models/paging-result';
import { PagingRequest } from '../../shared/models/paging-request';

const DATA: any[] = [
  { optikus: 'Ernő', datum: new Date(), model: 'A model', status: 'Gyártás alatt' },
  { optikus: 'Dániel', datum: new Date(), model: 'B model', status: 'Kiszállítva' },
  { optikus: 'Ernő', datum: new Date(), model: 'A model', status: 'Megrendelve' },
  { optikus: 'Vivien', datum: new Date(), model: 'B model', status: 'Gyártás alatt' },
  { optikus: 'Ernő', datum: new Date(), model: 'E model', status: 'Megrendelve' },
  { optikus: 'Anett', datum: new Date(), model: 'Z model', status: 'Kiszállítva' }
];

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit, AfterViewInit {
  dataSource = new EyewearDataSource<any, PagingRequest>();

  private displayedColumns: string[] = ['optikus', 'datum', 'model', 'status', 'controls'];
  @ViewChild(MatPaginator, { static: false }) private paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) private matSort: MatSort;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.init(this.paginator, this.matSort, this.displayedColumns, {}, (filter: PagingRequest) =>
      of(<PagingResult<any>>{ currentPage: 1, totalCount: 120, results: DATA })
    );
  }

  onView(item: any) {
    console.log('view', item);
  }
}
