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
	["MANAGE_MESSAGES"],
	async ({ bot, interaction, args }) => {
		const amount = args.amount as number;
		if (amount < 1 || amount > 99) throw "Amount must be between 1 and 99";

		const channel = bot.channels.cache.get(
			interaction.channel_id
		) as TextChannel;
		try {
			await channel.bulkDelete(amount + 1);
		} catch {
			throw "Cannot delete messages over 14 days old";
		}

		bot.util.sendMessage(interaction, {
			type: 3,
			data: {
				flags: 64,
				content: `🗑️ Deleted ${amount} message${amount === 1 ? "" : "s"}!`
			}
		});
	}
);
