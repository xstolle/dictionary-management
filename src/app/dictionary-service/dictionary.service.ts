import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as R from 'ramda';
import { DomainRange } from './domain-range';

@Injectable()
export class DictionaryService {
  // dictionary: DomainRange[] = [
  //   { id: 1, domain: 'x', range: '1' },
  //   { id: 2, domain: 'y', range: '2' },
  //   { id: 3, domain: 'z', range: '3' },
  //   { id: 4, domain: 'x', range: '1' },
  //   { id: 5, domain: '1', range: 'x' },
  //   { id: 6, domain: 'w', range: 'a' },
  //   { id: 7, domain: 'v', range: '5' },
  //   { id: 8, domain: 'z', range: '8' },
  //   { id: 9, domain: 'a', range: 'b' },
  //   { id: 10, domain: 'k', range: '11' },
  //   { id: 11, domain: 'k', range: '11' },
  //   { id: 12, domain: 'x', range: 'xia' },
  //   { id: 13, domain: 'j', range: 'h' },
  //   { id: 14, domain: 'h', range: 'j' }
  // ];
  dictionary: DomainRange[] = [
    { id: 1, domain: 'Stonegrey', range: 'Dark Grey' },
    { id: 2, domain: 'Skyblue', range: 'Light Grey' },
    { id: 3, domain: 'Sand', range: 'Biege' },
    { id: 4, domain: 'Stonegrey', range: 'Dark Grey' },
    { id: 5, domain: 'Dark Grey', range: 'Stonegrey' },
    { id: 6, domain: 'PitchBlack', range: 'Black' },
    { id: 7, domain: 'TupleYellow', range: 'Yellow' },
    { id: 8, domain: 'Black', range: 'Stone' }
  ];

  errors = [
    { errorCode: 'duplicate-different-range', color: 'pink' },
    { errorCode: 'duplicate-same-range', color: 'yellow' },
    { errorCode: 'chains', color: 'blue' },
    { errorCode: 'cycles', color: 'red' }
  ];

  lastId = R.last(this.dictionary).id;
  sortDirection = 'asc';
  sortTitle = 'domain';
  updateError = (errorCode) => R.assoc('error', errorCode);
  validateDictionary = this.markError(this.dictionary);
  sortedDictionary: DomainRange[] = this.sortByAlpha(this.validateDictionary, this.sortTitle, this.sortDirection);
  DictionarySubject: BehaviorSubject<Array<DomainRange>> = new BehaviorSubject(this.sortedDictionary);
  DomainRangeSubject: BehaviorSubject<DomainRange> = new BehaviorSubject(this.sortedDictionary[0]);

  constructor() {
    console.log('starting Dictionary service.');
  }

  getSortDirection = () => this.sortDirection;
  getSortTitle = () => this.sortTitle;
  getLastId = (dictionary) => R.last(dictionary).id;

  markError(dictionary) {
    const d = R.map(this.updateError('none'), dictionary);
    const d1 = this.duplicateDomainDictionary(d);
    const d2 = this.duplicateDomainRangeDictionary(d1);
    const d3 = this.chainsRangeDictionary(d2);
    const d4 = this.chainsDomainDictionary(d3)
    const d5 = this.cyclesDictionary(d4);
    return d5
  }

  getReducedDuplicateDomainList(dictionary) {
    const initList = [];
    const xLens = R.lensProp('count');
    const getCountList = (prev, x) => {
      const key = {
        domain: x.domain
      }
      const itemIndex = R.findIndex(R.propEq("key", key))(prev)
      if (itemIndex === -1) {
        return R.append({ key: key, count: 1 }, prev)
      }
      else {
        const item = R.nth(itemIndex, prev)
        const newItem = R.set(xLens, item.count + 1, item);
        return R.update(itemIndex, newItem, prev)
      }
    }
    const reducedList = R.reduce(getCountList, initList, dictionary);
    return reducedList
  }

  duplicateDomainDictionary(dictionary) {
    const reducedList = this.getReducedDuplicateDomainList(dictionary);

    const checkError = (x) => {
      const compareKey = {
        domain: x.domain
      }
      const item = R.find(R.propEq("key", compareKey))(reducedList)
      const isFound = R.propSatisfies(x => x > 1, 'count', item);
      return isFound
    }

    const markError = R.ifElse(
      checkError,
      this.updateError(this.errors[0].errorCode),
      R.identity
    )

    const result = R.map(markError, dictionary);
    return result
  }

  getReducedList(dictionary) {
    const initList = [];
    const xLens = R.lensProp('count');
    const getCountList = (prev, x) => {
      const key = {
        domain: x.domain,
        range: x.range
      }
      const itemIndex = R.findIndex(R.propEq("key", key))(prev)
      if (itemIndex === -1) {
        return R.append({ key: key, count: 1 }, prev)
      }
      else {
        const item = R.nth(itemIndex, prev)
        const newItem = R.set(xLens, item.count + 1, item);
        return R.update(itemIndex, newItem, prev)
      }
    }
    const reducedList = R.reduce(getCountList, initList, dictionary);
    return reducedList
  }

  duplicateDomainRangeDictionary(dictionary) {
    const reducedList = this.getReducedList(dictionary);

    const checkError = (x) => {
      const compareKey = {
        domain: x.domain,
        range: x.range
      }
      const item = R.find(R.propEq("key", compareKey))(reducedList)
      const isFound = R.propSatisfies(x => x > 1, 'count', item);
      return isFound
    }

    const markError = R.ifElse(
      checkError,
      this.updateError(this.errors[1].errorCode),
      R.identity
    )

    const result = R.map(markError, dictionary);
    return result
  }

  getChainsRangeList(dictionary) {
    const initList = [];
    const getList = (prev, x) => {
      const key = x.domain;
      return R.append({ key: key }, prev)
    }
    const reducedList = R.reduce(getList, initList, dictionary);
    return reducedList
  }

  chainsRangeDictionary(dictionary) {
    const reducedList = this.getChainsRangeList(dictionary);

    const checkError = (x) => {
      const compareKey = x.range;
      const isFound = R.find(R.propEq("key", compareKey))(reducedList)
      return isFound
    }

    const markError = R.ifElse(
      checkError,
      this.updateError(this.errors[2].errorCode),
      R.identity
    )

    const result = R.map(markError, dictionary);
    return result
  }

  getChainsDomainList(dictionary) {
    const initList = [];
    const getList = (prev, x) => {
      const key = x.range;
      return R.append({ key: key }, prev)
    }
    const reducedList = R.reduce(getList, initList, dictionary);
    return reducedList
  }

  chainsDomainDictionary(dictionary) {
    const reducedList = this.getChainsDomainList(dictionary);

    const checkError = (x) => {
      const compareKey = x.domain;
      const isFound = R.find(R.propEq("key", compareKey))(reducedList)
      return isFound
    }

    const markError = R.ifElse(
      checkError,
      this.updateError(this.errors[2].errorCode),
      R.identity
    )

    const result = R.map(markError, dictionary);
    return result
  }

  getCyclesList(dictionary) {
    const initList = [];
    const xLens = R.lensProp('count');
    const getList = (prev, x) => {
      const key = {
        domain: x.domain,
        range: x.range
      }
      return R.append({ key: key }, prev)
    }
    const reducedList = R.reduce(getList, initList, dictionary);
    return reducedList
  }

  cyclesDictionary(dictionary) {
    const reducedList = this.getCyclesList(dictionary);
    const checkError = (x) => {
      const compareKey = {
        domain: x.range,
        range: x.domain
      }
      const isFound = R.find(R.propEq("key", compareKey))(reducedList)
      return isFound
    }

    const markError = R.ifElse(
      checkError,
      this.updateError(this.errors[3].errorCode),
      R.identity
    )

    const result = R.map(markError, dictionary);
    return result
  }

  sortByAlpha(dictionary, title, direction): DomainRange[] {
    this.sortDirection = direction;
    this.sortTitle = title;
    if (R.equals(direction, 'asc')) {
      var sorted = R.sortWith([
        R.ascend(R.prop(title))
      ]);
    } else {
      var sorted = R.sortWith([
        R.descend(R.prop(title))
      ]);
    }
    return sorted(dictionary);
  }

  onSortByAlpha = (dictionary, title, direction) => {
    this.sortedDictionary = this.sortByAlpha(dictionary, title, direction);
    this.DictionarySubject.next(this.sortedDictionary);
  }

  onEdit = (dictionary, id) => {
    const index = R.findIndex(R.propEq('id', id))(dictionary);
    const xLens = R.lensProp('editable');
    this.sortedDictionary[index] = R.set(xLens, true, this.sortedDictionary[index]);
    this.DictionarySubject.next(this.sortedDictionary);
  }

  onSave = (dictionary, id, d, r) => {
    const index = R.findIndex(R.propEq('id', id))(dictionary);
    const setLens = (key) => R.lensProp(key);
    this.sortedDictionary[index] = R.set(setLens('editable'), false, this.sortedDictionary[index]);
    this.sortedDictionary[index] = R.set(setLens('domain'), d, this.sortedDictionary[index]);
    this.sortedDictionary[index] = R.set(setLens('range'), r, this.sortedDictionary[index]);

    this.sortedDictionary = this.markError(this.sortedDictionary);
    this.sortedDictionary = this.sortByAlpha(this.sortedDictionary, this.sortTitle, this.sortDirection)
    this.DictionarySubject.next(this.sortedDictionary);
  }

  onDelete = (dictionary, id) => {
    const index = R.findIndex(R.propEq('id', id))(dictionary);
    this.sortedDictionary = R.remove(index, 1, dictionary);
    // console.log('this.sortedDictionary... delete Sand', this.sortedDictionary);
    this.sortedDictionary = this.markError(this.sortedDictionary);
    this.DictionarySubject.next(this.sortedDictionary);
  }

  onNew = () => {
    const newDomainRange = new DomainRange();
    newDomainRange.id = this.lastId + 1;
    // newDomainRange.domain = '';
    // newDomainRange.range = '';
    const newEditableDomainRange = R.assoc('editable', true, newDomainRange);
    this.sortedDictionary = R.prepend(newEditableDomainRange, this.sortedDictionary);
    this.lastId = newDomainRange.id;
    console.log('last id is ', this.lastId);
    this.DictionarySubject.next(this.sortedDictionary);
  }

  getDictionaryObservable = () => this.DictionarySubject;

  getSelectedDomainRangeObservable = () => this.DomainRangeSubject;
}
