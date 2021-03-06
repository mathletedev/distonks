import { stripIndents } from "common-tags";
import { SnowflakeUtil } from "discord.js";
import Command from "../command";

export default new Command(
	{
		name: "ping",
		description: "See the latency of the bot!"
	},
	{
		perms: ["SEND_MESSAGES", "EMBED_LINKS"],
		category: "Utilities",
		examples: ["/ping"]
	},
	async ({ bot, interaction }) => {
		const sent = SnowflakeUtil.deconstruct(interaction.id).timestamp;

		await bot.util.sendMessage(interaction, "Ping?");
		const ping = await bot.util.getMessage(interaction);

		await bot.util.editMessage(interaction, {
			title: "🏓 Pong!",
			description: stripIndents`
				❯ 💓 ${new Date(ping.timestamp).getTime() - sent}ms

				❯ ⌛ ${bot.ws.ping}ms
			`
		});
	}
);
