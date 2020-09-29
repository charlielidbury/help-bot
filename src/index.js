const Discord = require("discord.js");
const client = (module.exports = new Discord.Client());

const commands = require("./commands");
const startIssue = require("./startIssue");
// extends prototypes
// + Discord.Guild.prototype.extensions
require("./extensions");

PREFIX = process.env.PREFIX || "!";
OK_REACTION = "👌";
CONFIRM_REACTION = "👍";
RESOLVE_REACTION = "✔️";
BUMP_REACTION = "🔔";
EXIT_REACTION = "🚪";
client.locals = {};
client.locals.helpChannels = {};

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	// verifies each guild is setup correctly
	client.guilds.cache.each((guild) => {
		// check: #help exists
		if (!guild.extensions.helpChannel)
			console.warn(`Missing #help in ${guild}`);

		// check: >help exists
		if (!guild.extensions.helpCategory)
			console.warn(`Missing >help in ${guild}`);

		// check: @helper exists
		if (!guild.extensions.helpRole)
			console.warn(`Missing @helper in ${guild}`);

		// makes an entry in extensions.thanks for each channel
		guild.channels.cache.each((channel) => {
			if (channel.parentID !== guild.extensions.helpCategory.id) return;

			channel.extensions.thanks = new Set();
		});
	});
});

// prevents anyone but the bot changing scores
client.on("guildMemberUpdate", async function (oldMember, newMember) {
	if (newMember.extensions.updating) return;

	newMember.extensions.thanks = oldMember.extensions.thanks;
});

// stops tracking thanks in deleted channels
client.on("channelDelete", (channel) => {
	channel.extensions.thanks = undefined;
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
		msg.channel.id === msg.guild.extensions.helpChannel.id &&
		!msg.channel.extensions.thanks
	)
		startIssue(msg);
});

client.login(process.env.TOKEN);
