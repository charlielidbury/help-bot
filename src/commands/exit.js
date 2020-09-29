module.exports = async (msg) => {
	const { op } = JSON.parse(msg.channel.topic);

	// check:
	// ~ channel is a help channel
	if (msg.channel.parentID !== msg.guild.extensions.helpCategory.id) return;

	// check:
	// ~ origional poster is trying to exit
	if (msg.author.id === op)
		return msg.reply(
			`You can't leave, you started this! Use ${PREFIX}resolve to close this issue.`
		);

	// removes them from channel
	msg.channel.createOverwrite(msg.author, {
		VIEW_CHANNEL: false,
	});
};
