import { APIInteraction } from "discord-api-types";
import { Client, ClientOptions } from "discord.js";
import "dotenv-safe/config";
import { readdirSync } from "fs";
import { join } from "path";
import Command from "./commands/command";
import Util from "./utils/util";

export default class Bot extends Client {
	public cmds: Command[] = [];
	public util = new Util(this);

	public constructor(options?: ClientOptions) {
		super(options);

		this.on("ready", () => {
			this.loadCommands();
			// @ts-expect-error
			this.ws.on("INTERACTION_CREATE", this.interactionHandler.bind(this));
			this.setStatus();

			console.log(`#${this.user?.tag} is online!`);
		});
	}

	private setStatus() {
		this.user?.setActivity({
			name: "the stock market!",
			type: "COMPETING"
		});
	}

	private loadCommands() {
		readdirSync(join(__dirname, "commands")).forEach((cat) => {
			if (cat.endsWith(".js")) return;

			readdirSync(join(__dirname, "commands", cat)).forEach((file) => {
				const command: Command = require(`./commands/${cat}/${file}`).default;
				this.cmds.push(command);

				// @ts-expect-error
				this.api
					// @ts-expect-error
					.applications(this.user.id)
					.guilds(process.env.DEV_GUILD)
					.commands.post({
						data: command.props
					});
			});
		});
	}

	private interactionHandler(interaction: APIInteraction) {
		const name = interaction.data?.name.toLowerCase();
		const args = interaction.data?.options;

		const command = this.cmds.find((cmd) => cmd.props.name === name);
		if (!command) return;

		command.exec(this, interaction, args);
	}
}
