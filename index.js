const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
require('dotenv/config')
const { connect, Mongoose } = require("mongoose");
const eventHandler = require('./src/handlers/eventHandler')
const commandHandler = require('./src/handlers/commandHandler')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

commandHandler(client)

connect(process.env.MONGO_URL)
.then(() => {
	console.log('Succesfully connected to database')
})
.catch((error) => console.error(error))

eventHandler(client)

client.login(process.env.TOKEN)

module.exports = client