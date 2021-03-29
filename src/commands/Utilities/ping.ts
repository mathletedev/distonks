import { stripIndents } from "common-tags";
import { SnowflakeUtil } from "discord.js";
import Command from "../command";

export default new Command(
	{
		name: "ping",
		description: "See the latency of the bot!"
	},
	[],
	async ({ bot, interaction }) => {
		const sent = SnowflakeUtil.deconstruct(interaction.id).timestamp;

		await bot.util.sendMessage(interaction, "Ping?");
		const ping = await bot.util.getMessage(interaction);

		bot.util.editMessage(interaction, {
			title: "🏓 Pong!",
			description: stripIndents`❯ 💓 ${
				new Date(ping.timestamp).getTime() - sent
			}ms

			❯ ⌛ ${bot.ws.ping}ms`,
			color: bot.util.color("blue")
		});
	}
);
