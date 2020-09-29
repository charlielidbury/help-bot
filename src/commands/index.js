const fs = require("fs");

fs.readdirSync(__dirname).forEach((path) => {
	if (path === "index.js") return;

	const commandName = path.split(".")[0];

	module.exports[commandName] = require(`./${path}`);
});
