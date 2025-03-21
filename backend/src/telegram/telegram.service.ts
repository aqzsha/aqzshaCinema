import { Injectable } from '@nestjs/common';
import { Telegram } from './telegram.interface';
import { Telegraf } from 'telegraf';
import { getTelegramConfig } from 'src/config/telegram.config';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: Telegram;

  constructor() {
    this.options = getTelegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    msg: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId,
  ) {
    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'HTML',
      ...options,
    });
  }

  async sendPhoto(
    photo: string,
    msg?: string,
    chatId: string = this.options.chatId,
  ) {
    await this.bot.telegram.sendPhoto(chatId, photo, {
      caption: msg,
    });
  }
}
