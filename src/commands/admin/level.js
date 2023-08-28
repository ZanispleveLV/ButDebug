const canvacord = require('canvacord')
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const levelSchema = require('../../models/level-schema')
const levelsXp = require('../../utility/levelsXp')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription(`Get your rank or another member's rank`)
    .addUserOption(option =>
        option.setName('user')
        .setDescription('User to check ranking')
    ),
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser('user') || interaction.user;
        const target = user.id;

        
        try{
            const member = await interaction.guild.members.fetch(target);

            if(target === interaction.client.user.id){
                return interaction.reply(`Hello, that's me! **I'm un-rankable!!!**`)
            }

            if(user.bot){
                return interaction.reply(`${user} is a **bot**! Bots aren't invited to the **rank party**`)
            }``

            const fetchedLvl = await levelSchema.findOne({
                userId: target,
                guildId: interaction.guild.id,
            })

            let allLvl = await levelSchema.find({
                guildId: interaction.guild.id
            }).select('_id userId level xp')

            allLvl.sort((a, b) => {
                if(a.level === b.level){
                    return b.xp - a.xp
                }else{
                    return b.level - a.level
                }
            })

            let currentRank = allLvl.findIndex((lvl) => lvl.userId === target) + 1

            const rank = new canvacord.Rank()
                .setAvatar(member.user.displayAvatarURL())
                .setRank(currentRank)
                .setLevel(fetchedLvl.level)
                .setCurrentXP(fetchedLvl.xp)
                .setRequiredXP(levelsXp(fetchedLvl.level))
                .setUsername(member.user.username)
                .setProgressBar('#F0F8FF', 'COLOR')
            
            const data = await rank.build() 
            const attachment = new AttachmentBuilder(data)
            interaction.reply({ files: [attachment] })

        }catch(error){
            console.error(error);
            interaction.reply('An error occurred while fetching the levels')
        }
    }
}