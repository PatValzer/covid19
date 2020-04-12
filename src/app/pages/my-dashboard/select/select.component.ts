import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  protected _onDestroy = new Subject<void>();
  @Input()
  multiple = true;

  @Input()
  label;

  public filteredItems: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  @Input()
  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
    this.itemsCache = this._items;
    if (items != null) {
      this.filteredItems.next(items.slice());
    }
  }

  _items = [];
  itemsCache = [];

  @Output()
  selected = new EventEmitter<FormControl>();

  @Input()
  formControl = new FormControl();

  filterCtrl = new FormControl();
  constructor() { }

  ngOnInit(): void {
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterItems();
      });

  }

  toggleAllSelection() {
    if (this.formControl.value.length < this.items.length) {
      this.formControl.setValue(this.items);
    } else {
      this.formControl.setValue([]);
    }
    this.selected.emit(this.formControl);
  }

  selectionChange() {
    this.selected.emit(this.formControl);
  }

  protected filterItems() {
    debugger;
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredItems.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems.next(this.itemsCache.filter(item => item.toLowerCase().indexOf(search) > -1));
    // this.items = this.itemsCache.filter(item => item.toLowerCase().indexOf(search) > -1)
    // this.formControl.setValue(this.itemsCache.filter(item => item.toLowerCase().indexOf(search) > -1));
    // this.selected.emit(this.formControl);
  }
}
