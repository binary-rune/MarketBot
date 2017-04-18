import { SDEObject } from '../typings';
import { fuse, items } from '../market-bot';
import { sortArrayByObjectPropertyLength } from './arrays';
import { regionList } from '../regions';

export function guessUserItemInput(itemString: string): SDEObject {
  // let itemString = itemWords.join(' ');

  let itemData;

  let regex: RegExp;
  let possibilities: Array<SDEObject> = [];
  // for (const _ of itemWords) {
  // Item did not 100% match anything in the item list
  // itemString = itemWords.join(' ');

  // Check in start of the words
  regex = new RegExp(`^${itemString}`, 'i');
  possibilities.push(...items.filter(_ => {
    if (_.name.en) {
      return _.name.en.match(regex);
    }
  }));

  if (!possibilities.length) {
    // Check at end of the words
    regex = new RegExp(`${itemString}$`, 'i');
    possibilities.push(...items.filter(_ => {
      if (_.name.en) {
        return _.name.en.match(regex);
      }
    }));

    if (!possibilities.length) {
      // Check in middle of words
      possibilities.push(...items.filter(_ => {
        if (_.name.en) {
          return _.name.en.toUpperCase().indexOf(itemString.toUpperCase()) !== -1;
        }
      }));
    }
  }

  // Sort by word length
  possibilities = sortArrayByObjectPropertyLength(possibilities, 'name', 'en');

  if (possibilities.length) {
    itemData = possibilities[0];
    // break;
  } else {
    itemData = <SDEObject> fuse.search(itemString)[0];
  }

  return itemData;
}

export function guessUserRegionInput(regionString: string): number {
  let foundRegion;

  for (const key in regionList) {
    if (regionList.hasOwnProperty(key)) {
      if (regionList[key].toUpperCase().indexOf(regionString.toUpperCase()) !== -1) {
        foundRegion = key;
        break;
      }
    }
  }
  return foundRegion;
}
