module.exports = (msg) => {
	// perms:
	// ~ user have MANAGE_CHANNELS
	if (!msg.member.hasPermission("MANAGE_CHANNELS")) return;

	// resets
	const helpChannel = msg.guild.extensions.helpChannel;
	msg.guild.channels.cache.map(async (channel) => {
		// deletes all but 1 help channels
		if (
			channel.name === "help" &&
			channel.type === "text" &&
			channel.id !== helpChannel.id
		)
			channel.delete();

		// deletes all help threads
		if (channel.parentID === msg.guild.extensions.helpCategory.id)
			channel.delete();
	});
};
