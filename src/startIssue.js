const commands = require("./commands");

module.exports = async function (msg) {
	// initialises thanks
	msg.channel.extensions.thanks = new Set();

	// sends setup message
	msg.channel
		.send({
			embed: {
				title: "Issue created!",
				timestamp: new Date(),
				footer: {
					text: "Happy debugging!",
				},
				fields: [
					{
						name: `\`${PREFIX}resolve\``,
						value: "Deletes this channel.",
						inline: true,
					},
					{
						name: `\`${PREFIX}bump\``,
						value: "Lets the helpers know you're still stuck.",
						inline: true,
					},
					{
						name: `\`${PREFIX}thanks @[dude]\``,
						value: "Shows your appreciation for @[dude].",
						inline: true,
					},
					{
						name: `\`${PREFIX}exit\``,
						value: "Removes you from this channel.",
						inline: true,
					},
				],
			},
		})
		.then((introMsg) => {
			introMsg.react(RESOLVE_REACTION);
			introMsg.react(BUMP_REACTION);
			introMsg.react(EXIT_REACTION);

			introMsg
				.createReactionCollector()
				.on("collect", (reaction, user) => {
					if (user.bot) return;

					console.log(msg.channel.send);
					if (reaction === RESOLVE_REACTION) {
						// fakes a !resolve command
						// commands.resolve({
						// 	...msg,
						// 	author: user,
						// 	member: msg.guild.members.cache.find(
						// 		(member) => member.user.id === user.id
						// 	),
						// 	reply: msg.channel.send.bind(msg.channel),
						// });
					} else if (reaction === BUMP_REACTION) {
						// fakes a !bump
						// commands.bump({
						// 	...msg,
						// });
					} else if (reaction === EXIT_REACTION) {
						// fakes a !exit
						// commands.exit({
						// 	...msg,
						// 	author: user,
						// 	reply: msg.channel.send.bind(msg.channel),
						// });
					}
				});
		});

	// clones #help
	await msg.channel.clone();

	// edits channel
	msg.channel.edit({
		name: msg.guild.extensions.nextHelpChannelName,
		topic: JSON.stringify({
			op: msg.author.id,
		}),
		parentID: msg.guild.extensions.helpCategory.id,
		permissionOverwrites: [
			{
				id: msg.member, // allows the op to see
				allow: "VIEW_CHANNEL",
			},
			{
				id: msg.guild.extensions.helpRole, // allows helpers to see
				allow: "VIEW_CHANNEL",
			},
			{
				id: msg.guild.roles.everyone, // prevents everyone else from seeing
				deny: "VIEW_CHANNEL",
			},
		],
	});
};
