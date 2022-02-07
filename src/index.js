const Discord = require("discord.js");
const client = (module.exports = new Discord.Client());

const commands = require("./commands");
const startIssue = require("./startIssue");
const {
	getHelpChannel,
	getHelpCategory,
	getArchiveCategory,
	getHelpRole,
	updating,
	setMemberThanks,
	getMemberThanks,
	channelThanks
} = require("./utils");

PREFIX = process.env.PREFIX || "!";
OK_REACTION = "👌";
CONFIRM_REACTION = "👍";
RESOLVE_REACTION = "✔️";
THANKS_REACTION = "👏";
// BUMP_REACTION = "🔔";
EXIT_REACTION = "🚪";

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	// verifies each guild is setup correctly
	client.guilds.cache.each((guild) => {
		// check: #help exists
		if (!getHelpChannel(guild))
			console.warn(`Missing #help in ${guild}`);

		// check: >help exists
		if (!getHelpCategory(guild))
			console.warn(`Missing >help in ${guild}`);
		
		// check: >help archive exists
		if (!getArchiveCategory(guild))
			console.warn(`Missing >help archive in ${guild}`);

		// check: @helper exists
		if (!getHelpRole(guild))
			console.warn(`Missing @helper in ${guild}`);

		// makes an entry in channelThanks for each channel
		guild.channels.cache.each((channel) => {
			if (channel.parentID !== getHelpCategory(guild).id) return;

			channelThanks[channel.id] = new Set();
		});
	});
});

// prevents anyone but the bot changing scores
client.on("guildMemberUpdate", async function (oldMember, newMember) {
	if (updating.has(newMember.id)) return;

	setMemberThanks(newMember, getMemberThanks(oldMember));
});

// stops tracking thanks in deleted channels
client.on("channelDelete", (channel) => {
	delete channelThanks[channel.id];
});

client.on("message", async function (msg) {
	// stops the bot reacting to other bots
	if (msg.author.bot) return;

	// command
	if (msg.content.startsWith(PREFIX)) {
		const commandName = msg.content.match(/(!(\w+))?/)[2];
		// forwards to command
		const command = commands[commandName];
		if (command) command(...arguments);
	}

	// message in #help
	if (
		msg.channel.id === getHelpChannel(msg.guild).id &&
		!channelThanks[msg.channel.id]
	)
		startIssue(msg);

	// message in >help archive
	if (msg.channel.parentID === getArchiveCategory(msg.guild).id)
		msg.channel.edit({
			parentID: getHelpCategory(msg.guild).id
		});
});

client.login(process.env.TOKEN);
