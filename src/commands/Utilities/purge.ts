import { TextChannel } from "discord.js";
import Command from "../command";

export default new Command(
	{
		name: "purge",
		description: "Deletes messages from a text channel!",
		options: [
			{
				name: "amount",
				description: "The number of messages to delete",
				type: 4,
				required: true
			}
		]
	},
	{
		perms: ["MANAGE_MESSAGES"],
		category: "Utilities",
		examples: ["/purge 20"]
	},
	async ({ bot, interaction, args }) => {
		const amount = args.amount as number;
		if (amount < 1 || amount > 100) throw "Amount must be between 1 and 100";

		const channel = bot.channels.cache.get(
			interaction.channel_id
		) as TextChannel;
		const deleted = await channel.bulkDelete(amount, true);

		if (deleted.size === 0) throw "No messages to delete";

		await bot.util.sendMessage(interaction, {
			type: 3,
			data: {
				flags: 64,
				content: `🗑️ Deleted ${deleted.size} message${
					deleted.size === 1 ? "" : "s"
				}!`
			}
		});
	}
);
