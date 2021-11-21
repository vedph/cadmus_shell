import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '@myrmidon/cadmus-core';
import { EditItemQuery } from '@myrmidon/cadmus-state';

@Component({
  selector: 'cadmus-current-item-bar',
  templateUrl: './current-item-bar.component.html',
  styleUrls: ['./current-item-bar.component.css'],
})
export class CurrentItemBarComponent implements OnInit {
  public item$: Observable<Item | undefined>;

  constructor(private _query: EditItemQuery) {
    this.item$ = this._query.select((state) => state.item);
  }

  ngOnInit(): void {}
}
