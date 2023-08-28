const warnSchema = require('../../models/warn-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarn')
        .setDescription('Clear warnings for a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to clear warnings for')
            .setRequired(true)
        ),
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser('user');

        try{
            await warnSchema.deleteMany({ userId: user.id });

            const embed = new EmbedBuilder()
                .setDescription(`Cleared warnings for the ${user.tag}`)
                .setColor("#FF2145")
            interaction.reply({ embeds: [embed] });
            
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while clearing warnings the warnings.')
                .setColor('#F04A47');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}