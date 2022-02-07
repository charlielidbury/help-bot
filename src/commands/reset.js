const {
	getHelpChannel,
	getHelpCategory,
} = require("../utils");

module.exports = (msg) => {
	// perms:
	// ~ user have MANAGE_CHANNELS
	if (!msg.member.hasPermission("MANAGE_CHANNELS")) return;

	// resets
	const helpChannel = getHelpChannel(msg.guild);
	msg.guild.channels.cache.map(async (channel) => {
		// deletes all but 1 help channels
		if (
			channel.name === "help" &&
			channel.type === "text" &&
			channel.id !== helpChannel.id
		)
			channel.delete();

		// deletes all help threads
		if (channel.parentID === getHelpCategory(msg.guild).id)
			channel.delete();
	});
};
