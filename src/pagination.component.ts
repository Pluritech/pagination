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
  private pageActive: number = 4;
  private totPages: number;
  private lengthPages: number = 7;
  private middlePos: number = Math.ceil(this.lengthPages/2);

  public listPages = {};

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

  public goPageStr(n: string) {
    this.goPage(Number.parseInt(n));
  }

  private goPage(nPage: number) {
    const offset = this.limit * (nPage - 1);
    this.pageActive = nPage;
    this.initPagination();
    console.log('goPage', nPage);
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

  public getNumberPage(pos: number): string {
    let numberPage = 0;
    let factor = this.middlePos - pos;
    if(factor >= 0) {
      numberPage = this.pageActive - factor;
    } else {
      factor = (factor < 0 ? factor * -1 : factor); // only postive
      numberPage = this.pageActive + factor;
    }
    if(numberPage > this.totPages || numberPage <= 0) {
      numberPage = 0;
    }
    return numberPage < 10 ? `0${numberPage}` : numberPage+'';
  }

  private initPagination() {
    for(let i = 1; i <= this.lengthPages; i++) {
      this.listPages[i] = this.getNumberPage(i);
    }
    console.log(this.listPages);
  }

  ngOnChanges() {
    console.log('ngOnChanges');
    if (this.showPagination()) {
      // init the pagination
      this.totPages = this.lastPage = Math.ceil((this.total / this.limit));
      this.initPagination();

    }
  }

}
