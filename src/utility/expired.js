const banSchema = require('../models/ban-schema')
const client = require('../../index')

module.exports = () => {
    console.log(client)
    const check = async () => {
        const query = {
            expires: { $lt: new Date()}
        }

        const results = await banSchema.find(query)
        console.log(results)

        const guild = results[0].guildId;
        console.log('Guild: ' + guild)
        for (const result of results){
            
            const { guildId, userId } = result

            await client.guilds.members.unban(userId, 'Ban expired')
        }

        await banSchema.deleteMany(query)
        console.log('Unbaned')
        setTimeout(check, 1000 * 60)
    }
    check()
}
