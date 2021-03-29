import {
	APIApplicationCommandInteractionDataOption,
	APIInteraction,
	PermissionFlagsBits,
	RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types";
import { PermissionString } from "discord.js";
import Bot from "../bot";

interface CommandExecutionArgs {
	bot: Bot;
	interaction: APIInteraction;
	args: Record<string, any>;
}

type CommandExecutionType = (args: CommandExecutionArgs) => Promise<any>;

export default class Command {
	public props: RESTPostAPIApplicationCommandsJSONBody;
	public perms: PermissionString[];
	private _exec: CommandExecutionType;

	public constructor(
		props: RESTPostAPIApplicationCommandsJSONBody,
		perms: PermissionString[],
		exec: CommandExecutionType
	) {
		this.props = props;
		this.perms = perms;
		this._exec = exec;
	}

	public exec(
		bot: Bot,
		interaction: APIInteraction,
		args?: APIApplicationCommandInteractionDataOption[]
	) {
		for (const perm of this.perms) {
			if (
				(BigInt(interaction.member.permissions) & PermissionFlagsBits[perm]) !==
				PermissionFlagsBits[perm]
			) {
				return bot.util.sendMessage(interaction, {
					type: 3,
					data: {
						flags: 64,
						content: `❌ You need the \`${bot.util.parsePerm(
							perm
						)}\` permission to use this command`
					}
				});
			}
		}

		let parsedArgs: Record<string, any> = {};
		if (args) {
			for (const arg of args) parsedArgs[arg.name] = arg.value;
		}

		this._exec({ bot, interaction, args: parsedArgs }).catch((err) => {
			try {
				if (typeof err !== "string") return bot.util.sendError(interaction);
				bot.util.sendError(interaction, err);
			} catch (err) {
				console.log(err);
			}
		});
	}
}
