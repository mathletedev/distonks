import "dotenv-safe/config";
import Bot from "./bot";

const bot = new Bot();

bot.login(process.env.BOT_TOKEN);
