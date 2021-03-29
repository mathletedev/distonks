import { stripIndents } from "common-tags";
import Command from "../command";

export default new Command(
	{
		name: "help",
		description: "See how to use commands!",
		options: [
			{
				name: "command",
				description: "The command you want to see",
				type: 3
			}
		]
	},
	{
		perms: [],
		category: "Utilities",
		examples: ["/help", "/help ping"]
	},
	async ({ bot, interaction, args }) => {
		if (args.command) {
			const command = bot.cmds.find((cmd) => cmd.props.name === args.command);
			if (!command) throw `Unknown command: \`${args.command}\``;

			const usage = `/${command.props.name}${
				command.props.options
					? command.props.options.map(
							(opt) =>
								`${opt.required ? "<" : "["} ${opt.name} ${
									opt.required ? ">" : "]"
								}`
					  )
					: ""
			}`;

			await bot.util.sendMessage(interaction, {
				title: "📓 Help",
				description: stripIndents`
          ❯ **Command:** \`${command.props.name}\`
          ❯ **Description:** ${command.props.description}
          ❯ **Usage:** \`${usage}\`
          ❯ **Category:** ${command.details.category}
          ❯ **Permissions:** ${
						command.details.perms.length
							? command.details.perms
									.map((perm) => `\`${bot.util.parsePerm(perm)}\``)
									.join(" ")
							: "None"
					}
          ❯ **Examples:**\n${command.details.examples
						.map((ex) => `\`${ex}\``)
						.join(" ")}
        `
			});
		} else {
			const EMOJIS: Record<string, string> = {
				Utilities: "🛠️"
			};

			await bot.util.sendMessage(interaction, {
				title: "📓 Help",
				description:
					"Type `/help [ command ]` to see more info on that command!",
				fields: bot.categories.map((cat) => ({
					name: `${EMOJIS[cat]} ${cat}`,
					value: bot.cmds
						.filter((cmd) => cmd.details.category === cat)
						.map((cmd) => `\`${cmd.props.name}\``)
						.join("\n"),
					inline: true
				}))
			});
		}
	}
);
