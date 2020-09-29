const { user } = require("..");

module.exports = async function (msg) {
	const { op } = JSON.parse(msg.channel.topic);

	// perms:
	// ~ must be the origional poster
	// ~ or have MANAGE_CHANNELS
	if (msg.author.id !== op && !msg.member.hasPermission("MANAGE_CHANNELS"))
		return;

	// check:
	// ~ has thanked someone
	if (msg.channel.extensions.thanks.size === 0) {
		const reply = await msg.reply(
			`You forgot to thank the people who helped you! ` +
				`Use the ${PREFIX}thank command to show your appreciation. ` +
				`Then press ${CONFIRM_REACTION}.`
		);

		await reply.extensions.confirmation;
	}

	// resolves
	msg.channel.delete();
};
