import * as Discord from 'discord.js';
import { UniverseApi } from '../swagger/api';
import { SDEObject } from './typings';
import { infoFunction } from './commands/info';
import { ordersFunction } from './commands/orders';
import { priceFunction } from './commands/price';
import { readToken, readTypeIDs } from './helpers/readers';
import { parseTypeIDs } from './helpers/parsers';
import { startLogger } from './helpers/command-logger';
import path = require('path');
import Fuse = require('fuse.js');
import { Logger, logger } from './helpers/program-logger';
import programLogger = require('./helpers/program-logger');

export const creator = {name: 'Ionaru', id: '96746840958959616'};
export const playing = {game: {name: 'with ISK (/i for info)'}};

export const universeApi = new UniverseApi();
export let items: Array<SDEObject>;

export let client: Discord.Client;
export let fuse: Fuse;
export let token: string;

const tokenPath = path.join(__dirname, '../config/token.txt');
const typeIDsPath = path.join(__dirname, '../data/typeIDs.yaml');

export const commandPrefix = '/';
export const priceCommand = commandPrefix + 'p';
export const regionCommand = commandPrefix + 'r';
export const limitCommand = commandPrefix + 'l';
export const ordersCommand = commandPrefix + 'c';
export const infoCommand = commandPrefix + 'i';

async function activate() {
  programLogger.logger = new Logger();

  logger.info('Bot has awoken, loading typeIDs.yaml');
  const typeIDs = readTypeIDs(typeIDsPath);
  logger.info('File loaded, starting parse cycle');
  items = parseTypeIDs(typeIDs);

  fuse = new Fuse(items, {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 128,
    tokenize: true,
    minMatchCharLength: 1,
    keys: ['name.en']
  });

  logger.info(`Parsing complete, ${items.length} items loaded into memory`);

  token = readToken(tokenPath);

  await startLogger();

  client = new Discord.Client();
  client.login(token);
  client.once('ready', () => {
    announceReady();
  });
}

function announceReady() {
  client.user.setPresence(playing).then();
  client.on('message', (message: Discord.Message) => {
    processMessage(message).then().catch((error: Error) => {
      handleError(message, error);
    });
  });
  logger.info('I am online!');
}

async function deactivate() {
  logger.info('Quitting!');
  await client.destroy();
  logger.info('Done!');
  process.exit(0);
}

async function processMessage(discordMessage: Discord.Message) {
  if (discordMessage.content.match(new RegExp(`^${priceCommand}`, 'i'))) {
    await priceFunction(discordMessage);
  } else if (discordMessage.content.match(new RegExp(`^${ordersCommand}`, 'i'))) {
    await ordersFunction(discordMessage);
  } else if (discordMessage.content.match(new RegExp(`^${infoCommand}`, 'i'))) {
    await infoFunction(discordMessage);
  }
}

export function handleError(message, error) {
  const time = Date.now();
  logger.error(`Caught error @ ${time}\n`, error);
  message.channel.sendMessage(
    `**ERROR** Something went wrong, please consult <@${creator.id}>\n\n` +
    `Error message: \`${error.message} @ ${time}\``
  ).then();
}

activate().then();
process.stdin.resume();
process.on('unhandledRejection', function (reason: string, p: Promise<any>): void {
  logger.error('Unhandled Rejection at: Promise', p, '\nreason:', reason);
});
process.on('uncaughtException', function (error) {
  logger.error(error);
  deactivate().then();
});
process.on('SIGINT', () => {
  deactivate().then();
});
