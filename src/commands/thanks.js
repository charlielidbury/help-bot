module.exports = async (msg) => {
	// check:
	// ~ is help channel
	if (msg.channel.parentID !== msg.guild.extensions.helpCategory.id)
		return msg.reply("Must thank in the channel you were helped in.");

	// check:
	// ~ is op
	const { op } = JSON.parse(msg.channel.topic);
	if (msg.author.id !== op)
		return msg.reply(
			`Only ${msg.guild.members.cache.get(op)} can thank people here!`
		);

	// thanks everyone
	msg.mentions.members.each((member) => {
		// check:
		// ~ aren't thanking themselves
		if (member.id === msg.member.id)
			return msg.reply("You can't thank yourself!");

		// check:
		// ~ member hasn't been thanked already
		if (msg.channel.extensions.thanks.has(member.id))
			return msg.reply(`${member} has already been thanked!`);

		// prevents from being thanked twice
		msg.channel.extensions.thanks.add(member.id);

		// updates nickname
		member.extensions.thanks++;

		// reacts with thumbs up
		msg.react(OK_REACTION);
	});
};
