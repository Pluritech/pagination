import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Page } from './models/page';

@Component({
  selector: 'pluritech-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  private firstPage: number;
  private lastPage: number;
  private pageActive: number = 1;
  private totPages: number;

  @Input() total: number = 0;
  @Input() limit: number = 1;

  @Output() changePage: EventEmitter<Page> = new EventEmitter<Page>();

  constructor() {
  }

  public next() {
    if (this.canNext()) {
      this.goPage(++this.pageActive);
    }
  }

  public prev() {
    if (this.canPrev()) {
      this.goPage(--this.pageActive);
    }
  }

  public goPage(nPage: number) {
    const offset = this.limit * (nPage - 1);
    this.changePage.emit({
      limit: this.limit,
      nPage: nPage,
      offset: offset,
      total: this.total
    });
  }

  public showPagination(): boolean {
    return this.total > 0;
  }

  public canPrev(): boolean {
    return this.pageActive > this.firstPage;
  }

  public canNext(): boolean {
    return this.pageActive < this.lastPage;
  }

  ngOnChanges() {
    if (this.showPagination()) {
      // init the pagination
      this.totPages = this.lastPage = Math.ceil((this.total / this.limit));
    }
  }

}
