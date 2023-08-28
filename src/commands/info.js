const warnSchema = require('../models/warn-schema')
const banSchema = require('../models/ban-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Check an info about member")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMembers)
        .addUserOption(option =>
            option.setName("user")
            .setDescription("Select user to check info")
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("userid")
            .setDescription("User ID of the user")
            .setRequired(false)
        ),
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser("user") || interaction.user;
        const userId = options.getString("userid") || interaction.user;

        try {
            const member = await interaction.guild.members.fetch(user.id);

            const bans = await interaction.guild.bans.fetch()
            const banned = bans.find(ban => ban.user.id == userID)

            console.log(`Bani atrasti`)

            const warnings = await warnSchema.find({
                userId: user?.id,
                guildId: interaction.guild.id,
            })

            console.log('Brīdinājumi atrasti' + warnings)

            if(banned){
                const banIssuer = banned.executor.tag;
                const embed = new EmbedBuilder()
                    .setTitle(`${user}'s Information`)
                    .setFields(
                        {name: 'Username', value: user.username, inline: false},
                        {name: 'ID', value: userId, inline: false},
                        {name: 'Status', value: 'Banned', inline: true},
                        {name: 'Reason', value: banned.reason, inline: true},
                        {name: 'Banned by', value: banIssuer, inline: true},
                        {name: 'Banned at', value: banned.createdAt.toLocaleString(), inline: true}
                    )
                    .setThumbnail(user.displayAvatarURL())
                    .setColor('#FF2145')
                    .setTimestamp()
                return interaction.reply({embeds: [embed]})
            }

            const roles = member.roles.catch
            const roleMentions = []
            for(const role in roles){
                roleMentions.push(role.toString())
            }

            const allRoleMentions = roleMentions.join(', ')

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s Information`)
                .setFields(
                    {name: 'Username', value: user, inline: false},
                    {name: 'ID', value: user.id, inline: false},
                    {name: 'Roles', value: allRoleMentions, inline: true},
                    {name: 'Warnings', value: warnings.count, inline: false}
                )
                .setThumbnail(user.displayAvatarURL())
                .setColor('#FF2145')
                .setTimestamp()
            interaction.reply({embeds: [embed]})

            
        }catch (error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription("An error occurred while fetching the member information.")
                .setColor("#FF2145");
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}