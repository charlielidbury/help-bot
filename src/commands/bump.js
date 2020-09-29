module.exports = async function (msg) {
	msg.channel.send(
		`${msg.guild.extensions.helpRole} come in here and help this poor guy! Or tell him why you can't...`
	);
};
