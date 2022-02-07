
const {
	getHelpCategory,
	channelThanks,
	getMemberThanks,
} = require('../utils');

module.exports = async (msg) => {
	// check:
	// ~ is help channel
	if (msg.channel.parentID !== getHelpCategory(msg.guild).id)
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
		if (channelThanks[msg.channel.id].has(member.id))
			return msg.reply(`${member} has already been thanked!`);

		// prevents from being thanked twice
		channelThanks[msg.channel.id].add(member.id);

		// updates nickname
		setMemberThanks(member, getMemberThanks(member) + 1);

		// reacts with thumbs up
		msg.react(OK_REACTION);
	});
};
