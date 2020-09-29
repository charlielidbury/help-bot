const Discord = require("discord.js");

// allows easy access to computed properties
// guild.extensions.helpChannel -> #help (channel for asking for help)
// guild.extensions.helpCategory -> >help (category for unresolved questions)
// guild.extensions.helpRole -> @helper (role for people who want to help)
Object.defineProperty(Discord.Guild.prototype, "extensions", {
	get() {
		const guild = this;
		return {
			get helpChannel() {
				return guild.channels.cache.find(
					(channel) =>
						channel.name === "help" && channel.type === "text"
				);
			},
			get helpCategory() {
				return guild.channels.cache.find(
					(channel) =>
						channel.name === "help" && channel.type === "category"
				);
			},
			get helpRole() {
				return guild.roles.cache.find((role) => role.name === "helper");
			},
			get nextHelpChannelName() {
				const ns = guild.channels.cache.map(
					(channel) =>
						channel.name.match(/(issue-([0-9]+))?/)[2] || -Infinity
				);

				const n = Math.max(...ns, 0) + 1;

				return `issue-${n}`;
			},
		};
	},
});

const channelThanks = {};
// channel.extensions.thanks -> set of users who have been thanked
Object.defineProperty(Discord.GuildChannel.prototype, "extensions", {
	get() {
		const channel = this;
		return {
			get thanks() {
				return channelThanks[channel.id];
			},
			set thanks(val) {
				if (val === undefined) delete channelThanks[channel.id];

				channelThanks[channel.id] = val;
			},
		};
	},
});

// member.extensions.thanks -> how many times that user has been thanked
const updating = new Set();
Object.defineProperty(Discord.GuildMember.prototype, "extensions", {
	get() {
		const member = this;
		const nicknameRegex = /([0-9]+) \| (.+)/;
		return {
			get thanks() {
				const match = member.displayName.match(nicknameRegex);
				return match ? +match[1] : null;
			},
			set thanks(val) {
				const match = member.displayName.match(nicknameRegex);

				// check:
				// ~ thanks count has changed
				if (match && +match[1] === val) return;

				const nickname = match ? match[2] : member.displayName;

				member.extensions.updating = true; // prevents the nickname from being undone
				member
					.setNickname(
						val === null ? nickname : `${val} | ${nickname}`
					)
					.then(() => {
						member.extensions.updating = false;
					})
					.catch((err) => {
						member.send(
							`Someone said you helped them, but I can't increment your score! Please set your score to ${val}.\n` +
								`(This is because I can't change people's nicknames if they have a role higher than mine)`
						);
					});
			},
			get updating() {
				return updating.has(member.id);
			},
			set updating(val) {
				if (val) updating.add(member.id);
				else updating.delete(member.id);
			},
		};
	},
});

// message.extensions.confirmation
Object.defineProperty(Discord.Message.prototype, "extensions", {
	get() {
		const message = this;
		return {
			get confirmation() {
				return new Promise((resolve) => {
					message.onReaction(CONFIRM_REACTION, resolve);
				});
			},
			onReaction(reaction, callback) {
				message.react(reaction);

				// makes collector
				const collector = message.createReactionCollector(
					(reaction, user) =>
						reaction.emoji.name === reaction && !user.bot
				);

				// callback!
				collector.on("collect", callback);
			},
		};
	},
});
