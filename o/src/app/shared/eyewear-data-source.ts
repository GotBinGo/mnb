import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PagingRequest } from './models/paging-request';
import { PagingResult } from './models/paging-result';
// import { OrderDirection } from '../api/app.generated';
import { MatPaginator, PageEvent, MatSort, Sort, SortDirection } from '@angular/material';
import { upperFirst } from 'lodash';

export class EyewearDataSource<TModel, TFilter extends PagingRequest> implements DataSource<TModel> {
  displayedColumns: string[] = [];
  pageSizeOptions = [10, 25, 50, 100];
  isLoading = true;

  dataFunc: (filter: TFilter) => Observable<PagingResult<TModel>>;

  private dataSubject = new BehaviorSubject<TModel[]>([]);
  private lastFilter: TFilter;
  private paginator: MatPaginator;
  private matSort: MatSort;

  connect(collectionViewer: CollectionViewer): Observable<TModel[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
  }

  init(
    paginator: MatPaginator,
    matSort: MatSort,
    displayedColumns: string[],
    initialFilter: TFilter,
    dataFunc: (filter: TFilter) => Observable<PagingResult<TModel>>
  ) {
    this.paginator = paginator;
    this.matSort = matSort;
    this.dataFunc = dataFunc;
    this.lastFilter = initialFilter;

    setTimeout(() => (this.displayedColumns = displayedColumns));

    // lapozás hatására új oldal lekérése
    this.paginator.page.subscribe((event: PageEvent) => {
      this.lastFilter.page = event.pageIndex;
      this.lastFilter.pageSize = event.pageSize;
      this.load();
    });

    // rendezés módosulására szerveroldali rendezés
    this.matSort.sortChange.subscribe((event: Sort) => this.sortChange(event));

    this.sortChange({ direction: this.matSort.direction, active: this.matSort.active });
  }

  sortChange(event: { direction: SortDirection; active: string }) {
    if (event.direction === 'asc') {
      this.lastFilter.orderBy = event.active;
      // this.lastFilter.orderDirection = OrderDirection.Asc;
    } else if (event.direction === 'desc') {
      this.lastFilter.orderBy = event.active;
      // this.lastFilter.orderDirection = OrderDirection.Desc;
    } else {
      this.lastFilter.orderBy = null;
      this.lastFilter.orderDirection = null;
    }
    this.load();
  }

  filter(updateFilter: TFilter) {
    const newFilter = Object.assign({}, this.lastFilter, updateFilter);
    newFilter.page = 0;
    this.load(newFilter);
  }

  private load(filter?: TFilter) {
    this.lastFilter = filter || this.lastFilter || <TFilter>{};

    if (!this.dataFunc) {
      return;
    }

    Object.keys(this.lastFilter).forEach(k => {
      if (this.lastFilter[k] == null) {
        this.lastFilter[k] = undefined;
      }
    });

    const f = this.lastFilter;
    f.page = f.page || 0;
    f.pageSize = f.pageSize || this.pageSizeOptions[0];

    if (f.orderBy != null && f.orderBy.length > 0) {
      f.orderBy = upperFirst(f.orderBy);
    }

    this.isLoading = true;
    this.dataSubject.next([]);
    this.dataFunc(f)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(resp => {
        this.dataSubject.next(resp.results);
        this.paginator.length = resp.totalCount;
      });
  }
}
