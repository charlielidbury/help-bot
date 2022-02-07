const { user, guilds } = require("..");
const { 
	waitConfirmation,
	channelThanks,
	getArchiveCategory,
} = require("../utils");

module.exports = async function (msg) {
	const { op } = JSON.parse(msg.channel.topic);

	// perms:
	// ~ must be the origional poster
	// ~ or have MANAGE_CHANNELS
	if (msg.author.id !== op && !msg.member.hasPermission("MANAGE_CHANNELS"))
		return;

	// check:
	// ~ has thanked someone
	if (channelThanks[msg.channel.id].size === 0) {
		await waitConfirmation(await msg.reply(
			`You forgot to thank the people who helped you! ` +
				`Use the ${PREFIX}thank command to show your appreciation. ` +
				`Then press ${CONFIRM_REACTION}.`
		));
	}

	// resolves
	if (getArchiveCategory(msg.channel.guild)) {
		await msg.channel.edit({
			parentID: getArchiveCategory(msg.channel.guild).id,
		});
		
		msg.channel.send(`This channel has been archived, send a message to revive it.`);
	} else {
		await waitConfirmation(await msg.reply(
			`This channel will be deleted due to this server not having an archive channel, do you wish to continue?`,
		));

		msg.channel.delete();
	}
};