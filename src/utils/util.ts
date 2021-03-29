import {
	APIEmbed,
	APIEmbedFooter,
	APIInteraction,
	APIInteractionResponse,
	APIMessage
} from "discord-api-types";
import Bot from "../bot";

export default class Util {
	private bot: Bot;

	public constructor(bot: Bot) {
		this.bot = bot;
	}

	public getApplication(guildID?: string) {
		// @ts-expect-error
		let app = this.bot.api.applications(this.bot.user.id);
		if (guildID) app = app.guilds(guildID);

		return app;
	}

	public async sendMessage(
		interaction: APIInteraction,
		message: APIInteractionResponse | string | APIEmbed
	) {
		const data = this.toResponse(message, interaction);

		// @ts-expect-error
		await this.bot.api
			// @ts-expect-error
			.interactions(interaction.id, interaction.token)
			.callback.post({ data });
	}

	public async getMessage(interaction: APIInteraction): Promise<APIMessage> {
		// @ts-expect-error
		return await this.bot.api
			// @ts-expect-error
			.webhooks(this.bot.user?.id, interaction.token)
			.messages("@original")
			.patch({ data: {} });
	}

	public async editMessage(
		interaction: APIInteraction,
		message: string | APIEmbed
	) {
		const { data } = this.toResponse(message, interaction);

		// @ts-expect-error
		await this.bot.api
			// @ts-expect-error
			.webhooks(this.bot.user?.id, interaction.token)
			.messages("@original")
			.patch({ data });
	}

	public toResponse(
		data: APIInteractionResponse | string | APIEmbed,
		interaction: APIInteraction
	) {
		let tmp: APIInteractionResponse;

		if (typeof data === "string")
			tmp = {
				type: 4,
				data: {
					content: data
				}
			};
		else if ("type" in data) tmp = data as APIInteractionResponse;
		else {
			if (!data.color) data.color = this.color("blue");
			if (!data.footer) data.footer = this.footer(interaction);
			if (!data.timestamp) data.timestamp = new Date().toISOString();
			tmp = {
				type: 4,
				data: {
					content: "",
					embeds: [data]
				}
			};
		}

		return tmp;
	}

	public color(name: "blue") {
		switch (name) {
			case "blue":
				return 0x429bf5;
		}
	}

	public async sendError(
		interaction: APIInteraction,
		error: string = "Command execution failed"
	) {
		await this.sendMessage(interaction, {
			type: 3,
			data: {
				flags: 64,
				content: `❌ ${error}`
			}
		});
	}

	public parsePerm(perm: string) {
		return perm
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");
	}

	public footer(interaction: APIInteraction): APIEmbedFooter {
		return {
			text: interaction.member.nick ?? interaction.member.user.username,
			icon_url: interaction.member.user.avatar
				? `https://cdn.discordapp.com/${interaction.member.user.avatar}.png`
				: undefined
		};
	}
}
