import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { PageEvent } from './models/page-event';

@Component({
  selector: 'pluritech-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  private firstPage = 1;
  private lastPage: number;
  private pageActive = 1;
  private totPages: number;
  private lengthPages = 7;
  private middlePos: number = Math.ceil(this.lengthPages / 2);
  private lastPageEmmited: PageEvent;

  public listPages = {};

  private interval: any;

  @Input() total = 0;
  @Input() limit = 1;

  @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

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
    const page = Number.parseInt(n);
    if (this.canGoPage(page)) {
      this.goPage(page);
    }
  }

  public canGoPage(nPage: number) {
    if (nPage == 0 || nPage == this.pageActive) {
      return false;
    }
    return true;
  }

  private goPage(nPage: number) {
    const offset = this.limit * (nPage - 1);
    this.pageActive = nPage;
    this.initPagination();
    const objEvent: PageEvent = {
      limit: this.limit,
      nPage: nPage,
      offset: offset,
      total: this.total
    };
    this.emitEventChangePage(objEvent);
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
    if (numberPage > this.totPages || numberPage <= 0) {
      numberPage = 0;
    }
    return numberPage < 10 ? `0${numberPage}` : numberPage + '';
  }

  public continuous(direction: string): void {
    this.interval = setInterval(() => {
      if (direction ===  'right') {
        this.next();
      } else {
        this.prev();
      }
    }, 200);
  }

  public onMouseLeave() {
    this.stopContinuous();
    if(this.lastPageEmmited) { // Ensure that not emmit on first time
      this.goPage(this.pageActive);
    }
  }

  public onMouseUp() {
    this.stopContinuous();
  }

  private stopContinuous(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private initPagination() {
    for (let i = 1; i <= this.lengthPages; i++) {
      this.listPages[i] = this.getNumberPage(i);
    }
  }

  private emitEventChangePage(objEvent: PageEvent): void {
    // console.log('NOT EMIT emitEventChangePage', this.lastPageEmmited);
    const canEmmit = (!this.interval || this.pageActive === this.lastPage) &&
      (this.lastPageEmmited == null || this.lastPageEmmited.nPage != objEvent.nPage);
    if (canEmmit) {
      // console.log('emitted', objEvent);
      this.lastPageEmmited = objEvent;
      this.changePage.emit(objEvent);
    }
  }

  private _initAttr() {
    this.listPages = {};
    this.firstPage = 1;
    this.pageActive = 1;
    this.lengthPages = 7;
    this.middlePos = Math.ceil(this.lengthPages / 2);
  }

  ngOnChanges() {
    this._initAttr();
    if (this.showPagination()) { // init the pagination
      this.totPages = this.lastPage = Math.ceil((this.total / this.limit));
      this.initPagination();
    }
  }

}
