import { Component, OnInit } from '@angular/core';

import { DomainRange } from './../dictionary-service/domain-range';
import { DictionaryService } from './../dictionary-service/dictionary.service';

@Component({
  selector: 'domain-range',
  templateUrl: './domain-range.component.html',
  styleUrls: ['./domain-range.component.css']
})
export class DomainRangeComponent implements OnInit {
  dictionary$;
  domainRange$;
  sortedDictionary;
  selectedDomainRange;
  sortDirection: string;
  sortDomainIcon = 'arrow_downward';
  sortRangeIcon = 'sort_by_alpha';
  newAbled = true;

  constructor(private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.dictionary$ = this.dictionaryService.getDictionaryObservable()
      .subscribe(
      data => {
        this.sortedDictionary = data;
      },
      err => {
        console.log('Task List getDictionaryObservable Error: ' + err);
      },
      () => {
        console.log('Dictionary getDictionaryObservable Completed');
      })

    this.domainRange$ = this.dictionaryService.getSelectedDomainRangeObservable()
      .subscribe(
      data => {
        this.selectedDomainRange = data;
      },
      err => {
        console.log('Dictionary getSelectedDomainRangeObservable Error: ' + err);
      },
      () => {
        console.log('Dictionary getSelectedDomainRangeObservable Completed');
      })

    this.sortDirection = this.dictionaryService.getSortDirection();
  }

  ngOnDestroy(): void {
    this.dictionary$.unsubscribe();
    this.domainRange$.unsubscribe();
  }

  onEdit(dictionary, id) {
    this.newAbled = false;
    this.dictionaryService.onEdit(dictionary, id);
  }

  onSave(dictionary, id) {
    this.newAbled = true;
    const domain = document.getElementById('d' + id).innerHTML;
    const range = document.getElementById('r' + id).innerHTML;
    this.dictionaryService.onSave(dictionary, id, domain, range);
  }

  onDelete(dictionary, id) {
    this.dictionaryService.onDelete(dictionary, id);
  }

  onNew() {
    this.newAbled = false;
    this.dictionaryService.onNew()
  }

  onSortByAlpha(dictionary, title) {
    this.sortDirection = this.sortDirection === 'asc' ? 'des' : 'asc'
    const sortIcon = this.sortDirection === 'asc' ? 'arrow_downward' : 'arrow_upward';
    if (title === 'domain') {
      this.sortDomainIcon = sortIcon;
      this.sortRangeIcon = 'sort_by_alpha';
    }
    if (title === 'range') {
      this.sortRangeIcon = sortIcon;
      this.sortDomainIcon = 'sort_by_alpha';
    }
    console.log('you clicked on sort_by_alpha', this.sortDirection);
    this.dictionaryService.onSortByAlpha(dictionary, title, this.sortDirection);
  }
}
