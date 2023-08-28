const warnSchema = require('../models/warn-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delwarn')
        .setDescription('Delete a warning')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addStringOption(option =>
            option.setName('id')
            .setDescription('The ID of the warning')
            .setRequired(true)
        ),
    async execute(interaction){
        const {channel, options} = interaction;

        const id = options.getString('id');
        try{
            await warnSchema.findByIdAndDelete(id);

            const embed = new EmbedBuilder()
                .setDescription(`Deleted warning: **${id}**.`)
                .setColor("#FF2145")
            interaction.reply({ embeds: [embed] }); 
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while deleting warning.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }


    }    
}