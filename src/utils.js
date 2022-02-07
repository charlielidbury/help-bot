const Discord = require("discord.js");

// guild getters
module.exports.getHelpChannel = guild =>
    guild.channels.cache.find(
        channel => channel.name === "help" && channel.type === "text"
    );

module.exports.getHelpCategory = guild =>
    guild.channels.cache.find(
        (channel) =>
            channel.name === "help" && channel.type === "category"
    );

module.exports.getArchiveCategory = guild =>
    guild.channels.cache.find(
        (channel) =>
            channel.name === "help archive" && channel.type === "category"
    );

module.exports.getHelpRole = guild =>
    guild.roles.cache.find((role) => role.name === "helper");

module.exports.getNextHelpChannelName = guild => {
    const ns = guild.channels.cache.map(
        (channel) =>
            channel.name.match(/(issue-([0-9]+))?/)[2] || -Infinity
    );

    const n = Math.max(...ns, 0) + 1;

    return `issue-${n}`;
};

module.exports.channelThanks = {};

const nicknameRegex = /([0-9]+) \| (.+)/;
module.exports.getMemberThanks = member => {
    const match = member.displayName.match(nicknameRegex);
    return match ? +match[1] : null;
}
const updating = module.exports.updating = new Set();
module.exports.setMemberThanks = (member, thanks) => {
    const match = member.displayName.match(nicknameRegex);

    // check:
    // ~ thanks count has changed
    if (match && +match[1] === val) return;

    const nickname = match ? match[2] : member.displayName;

    updating.add(member.id); // prevents the nickname from being undone
    member
        .setNickname(
            val === null ? nickname : `${val} | ${nickname}`
        )
        .then(() => {
            updating.delete(member.id);
        })
        .catch((err) => {
            member.send(
                `Someone said you helped them, but I can't increment your score! Please set your score to ${val}.\n` +
                    `(This is because I can't change people's nicknames if they have a role higher than mine)`
            );
        });
}

module.exports.waitConfirmation = (message) => new Promise((resolve) => {
    module.exports.onReaction(message, CONFIRM_REACTION, resolve);
});

module.exports.onReaction = (message, reaction, callback) => {
    message.react(reaction);

    // makes collector
    const collector = message.createReactionCollector(
        (r, user) =>
            r.emoji.name === reaction && !user.bot
    );

    // callback!
    collector.on("collect", callback);

    return message;
}
