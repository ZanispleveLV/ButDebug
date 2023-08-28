const warnSchema = require('../models/warn-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Get warnings for a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to get warnings for')
            .setRequired(true)
        ),
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser('user');

        try{
            const warnings = await warnSchema.find({
                userId: user?.id,
                guildId: interaction.guild.id,
            })

            if(warnings == 0){
                const errEmbed = new EmbedBuilder()
                    .setDescription('There are no warnings')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed] });
            }

            let description = '';

            for(warn of warnings){
                description += `**ID:** ${warn._id}\n`
                description += `**Date:** ${warn.createdAt.toLocaleString()}\n`
                description += `**Staff:** <@${warn.staffId}>\n`
                description += `**Reason:** ${warn.reason}\n\n`
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s warnings`)
                .setDescription(description)
                .setColor("#FF2145") 
            interaction.reply({ embeds: [embed] });

        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while fetching warnings.')
                .setColor('#F04A47');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}