import { APIInteraction } from "discord-api-types";
import { ActivityOptions, Client, ClientOptions } from "discord.js";
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
		let status = 1;

		setInterval(() => {
			let activity: ActivityOptions = {
				name: "stonks!",
				type: "COMPETING"
			};
			if (status === 2)
				activity = {
					name: "/help !",
					type: "PLAYING"
				};
			else if (status === 3)
				activity = {
					name: `${this.guilds.cache.size} servers!`,
					type: "WATCHING"
				};

			this.user?.setActivity(activity);

			status = status === 3 ? 1 : status + 1;
		}, 5000);
	}

	private loadCommands() {
		readdirSync(join(__dirname, "commands")).forEach((cat) => {
			if (cat.endsWith(".js")) return;

			readdirSync(join(__dirname, "commands", cat)).forEach((file) => {
				const command: Command = require(`./commands/${cat}/${file}`).default;
				this.cmds.push(command);

				this.util
					.getApplication(process.env.DEV_GUILD)
					.commands.post({ data: command.props });
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
