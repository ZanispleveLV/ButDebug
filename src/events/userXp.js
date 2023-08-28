const levelSchema = require(`../models/level-schema`)
const levelsXp = require(`../utility/levelsXp`)
const cooldowns = new Set()

function rndXp(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'messageCreate',
    async execute (message){
        if(message.author.bot || cooldowns.has(message.author.id)) return

        const xpGive = rndXp(15, 25)

        console.log(`Generated ${xpGive} xp`)

        try{
            const level = await levelSchema.findOne({
                userId: message.author.id,
                guildId: message.guild.id
            })
    
            if(!level){
                await levelSchema.create({
                    userId: message.author.id,
                    guildId: message.guild.id,
                    xp: xpGive
                })   
            }else{
                console.log(`I have ${level.xp} xp`)
                level.xp += xpGive
                console.log(`Now i have ${level.xp} xp`)
                if (level.xp >= levelsXp(level.level)){
                    level.xp -= levelsXp(level.level)
                    level.level += 1
                    message.channel.send(`${message.member}, you just advanced to level ${level.level}!`)
                }
                await level.save().catch((error) => {
                    console.error(error);
                    return
                })
            }
    
            cooldowns.add(message.author.id)
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, 60000)
            
    
        }catch (error){
            console.error(error);
        }
    }
}