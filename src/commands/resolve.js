const { user, guilds } = require("..");

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
	if (msg.channel.guild.extensions.archiveCategory) {
		await msg.channel.edit({
			parentID: msg.channel.guild.extensions.archiveCategory.id,
		});
		
		msg.channel.send(`This channel has been archived, send a message to revive it.`);
	} else {
		const warning = await msg.reply(
			`This channel will be deleted due to this server not having an archive channel, do you wish to continue?`,
		);

		await warning.extensions.confirmation;

		msg.channel.delete();
	}
};