const warnSchema = require('../../models/warn-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a memmber')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('The reason for the warn')
            .setRequired(true)
        ),
        async execute(interaction){
            const {channel, options} = interaction;

            const user = options.getUser('user');
            const reason = options.getString('reason');

            try{
                const member = await interaction.guild.members.fetch(user.id);
                
                if(member.roles.highest.position >= interaction.member.roles.highest.position){
                    const errEmbed = new EmbedBuilder()
                        .setDescription(`Couldn't warn user ${user.tag}`)
                        .setColor('#F04A47');
                    return interaction.reply({ embeds: [errEmbed], ephemeral: true });
                }

                const warning = await warnSchema.create({
                    userId: user?.id,
                    staffId: interaction.member.id,
                    guildId: interaction.guild.id,
                    reason
                })

                const embed = new EmbedBuilder()
                    .setDescription(`**Warning has been issued for ${user}. ${warning.reason}**`)
                    .setColor("#43B582")
                interaction.reply({ embeds: [embed] });
            }catch(error){
                console.error(error);
                const errEmbed = new EmbedBuilder()
                    .setDescription('An error occurred while warning the member.')
                    .setColor('#F04A47');
                interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }
        }

}