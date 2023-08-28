const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName('userid')
            .setDescription('User ID to unban. Ex: {BOTID}')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for the unban')
            .setRequired(false)
        ),
    async execute(interaction){
        const {channel, options} = interaction;

        const userId = options.getString('userid');
        const reason = options.getString('reason') || 'No reason provided';

        try{
            const bans = await interaction.guild.bans.fetch()
            const banned = bans.get(userID)
            
            if(!banned){
                const errEmbed = new EmbedBuilder()
                    .setDescription('Person is not banned!')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            await this.guild.members.unban(userId, reason);
            
            const embed = new EmbedBuilder()
                .setTitle('Unban')
                .setDescription(`Successfully unbanned user with ID ${userId}`)
                .addFields(
                    {name: 'Reason', value: reason, inline: true}
                )
                .setColor('#FF2145')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while banning the member.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }   
}