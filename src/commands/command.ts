import {
	APIApplicationCommandInteractionDataOption,
	APIInteraction,
	APIInteractionResponse,
	RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types";
import Bot from "../bot";

type CommandExecutionType = (
	bot: Bot,
	interaction: APIInteraction,
	args?: APIApplicationCommandInteractionDataOption[]
) => Promise<APIInteractionResponse | void>;

export default class Command {
	public props: RESTPostAPIApplicationCommandsJSONBody;
	public exec: CommandExecutionType;

	public constructor(
		props: RESTPostAPIApplicationCommandsJSONBody,
		exec: CommandExecutionType
	) {
		this.props = props;
		this.exec = exec;
	}
}
