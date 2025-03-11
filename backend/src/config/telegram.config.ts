import { Telegram } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (): Telegram => ({
  // https://api.telegram.org/bot5070807616:AAGHWhiD9qTMz68gz6yccEXGRtY8x0ohOb0/getUpdates - for get chatId
  chatId: '5236067555',
  token: '7748967082:AAF12ya8LuseNpZxmNmzopLZzZMx9YUGQb4',
});
