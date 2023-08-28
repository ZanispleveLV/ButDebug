const expired = require('../utility/expired')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`The bot is ready! Logged in as ${client.user.tag}`);
		expired()
	},
};