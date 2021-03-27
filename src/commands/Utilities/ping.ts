import Command from "../command";

export default new Command(
	{
		name: "ping",
		description: "See the latency of the bot!"
	},
	async (bot) => {
		return {
			type: 4,
			data: {
				content: `Pong!\nLatency is \`${Math.round(bot.ws.ping)}\`ms!`
			}
		};
	}
);
