import { commandPrefix, limitCommandRegex, regionCommandRegex } from '../market-bot';
import { IParsedMessage, ISDEObject } from '../typings';

export function parseMessage(message: string): IParsedMessage {
  const parsedMessage: IParsedMessage = {
    item: null,
    limit: null,
    region: null
  };

  // Remove double spaces because that confuses the input guessing system
  let messageText = message.replace(/ +(?= )/g, '');
  let messageWords: string[];

  // Split the message into separate words and remove the first word (the command tag)
  messageWords = messageText.split(' ');
  messageWords.shift();

  if (messageWords) {
    messageText = messageWords.join(' ');
  }

  // Search for the item text
  let itemText = messageText;
  if (itemText.indexOf(commandPrefix) !== -1) {
    itemText = itemText.substring(0, itemText.indexOf(commandPrefix)).trim();
  }
  parsedMessage.item = itemText;

  // Search for the region text
  const regionMatch = messageText.match(regionCommandRegex);
  if (regionMatch) {
    let sep1 = messageText.substring(regionMatch.index + regionMatch[0].length).trim();
    if (sep1.indexOf(commandPrefix) !== -1) {
      sep1 = sep1.substring(0, sep1.indexOf(commandPrefix)).trim();
    }
    parsedMessage.region = sep1;
  }

  // Search for the limit text
  const limitMatch = messageText.match(limitCommandRegex);
  if (limitMatch) {
    let sep1 = messageText.substring(limitMatch.index + limitMatch[0].length).trim();
    if (sep1.indexOf(commandPrefix) !== -1) {
      sep1 = sep1.substring(0, sep1.indexOf(commandPrefix)).trim();
    }
    parsedMessage.limit = Number(sep1);
  }

  return parsedMessage;
}

export function parseTypeIDs(typeIDs: object): ISDEObject[] {
  const itemsArray = [];

  for (const key in typeIDs) {
    if (typeIDs.hasOwnProperty(key)) {
      const value: ISDEObject = typeIDs[key];
      value.itemID = Number(key);
      itemsArray.push(value);
    }
  }

  return itemsArray;
}
