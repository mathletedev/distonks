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
	args?: APIApplicationCommandInteractionDataOption[];
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

		this._exec({ bot, interaction, args }).catch((err) => {
			if (typeof err !== "string") return bot.util.sendError(interaction);
			bot.util.sendError(interaction, err);
		});
	}
}
