const commands = require("./commands");
const {
	channelThanks,
	onReaction,
	getNextHelpChannelName,
	getHelpCategory,
	getHelpRole,
} = require("./utils");

module.exports = async function (msg) {
	// initialises thanks
	channelThanks[msg.channel.id] = new Set();

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
						name: `\`${PREFIX}resolve\` ${RESOLVE_REACTION}`,
						value: "Marks issue as resolved.",
						inline: true,
					},
					// {
					// 	name: `\`${PREFIX}bump\``,
					// 	value: "Lets the helpers know you're still stuck.",
					// 	inline: true,
					// },
					{
						name: `\`${PREFIX}thanks @[dude]\` ${THANKS_REACTION}`,
						value: "Shows your appreciation for @[dude].",
						inline: true,
					},
					{
						name: `\`${PREFIX}exit\` ${EXIT_REACTION}`,
						value: "Removes you from this channel.",
						inline: true,
					},
				],
			},
		})
		.then((introMsg) => {
			onReaction(introMsg, RESOLVE_REACTION, (_, user) => {
				// fakes a !resolve command
				commands.resolve({
					...msg,
					author: user,
					member: msg.guild.members.cache.find(
						(member) => member.user.id === user.id
					),
					reply: msg.channel.send.bind(msg.channel),
				});
			});
			onReaction(introMsg, EXIT_REACTION, (_, user) => {
				// fakes a !exit
				commands.exit({
					...msg,
					author: user,
					reply: msg.channel.send.bind(msg.channel),
				});
			});

			// introMsg.react(RESOLVE_REACTION).then(() => {
			// 	console.log("done");
			// });
			// introMsg.react(BUMP_REACTION);
			// introMsg.react(EXIT_REACTION);

			// introMsg
			// 	.createReactionCollector()
			// 	.on("collect", (reaction, user) => {
			// 		if (user.bot) return;

			// 		console.log(msg.channel.send);
			// 		if (reaction === RESOLVE_REACTION) {
			// 			
			// 		} else if (reaction === BUMP_REACTION) {
			// 			
			// 		} else if (reaction === EXIT_REACTION) {
			// 		
			// 		}
			// 	});
		});

	// clones #help
	await msg.channel.clone();

	// edits channel
	msg.channel.edit({
		name: getNextHelpChannelName(msg.guild),
		topic: JSON.stringify({
			op: msg.author.id,
		}),
		parentID: getHelpCategory(msg.guild).id,
		permissionOverwrites: [
			{
				id: msg.member, // allows the op to see
				allow: "VIEW_CHANNEL",
			},
			{
				id: getHelpRole(msg.guild), // allows helpers to see
				allow: "VIEW_CHANNEL",
			},
			{
				id: msg.guild.roles.everyone, // prevents everyone else from seeing
				deny: "VIEW_CHANNEL",
			},
		],
	});
};
