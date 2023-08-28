const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to kick')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for kick')
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
                    .setDescription('You can not kick a member with a higher role than yours!')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('Kicked')
                .setDescription(`Succesfuly kicked ${user.tag}`)
                .addFields(
                    {name: 'Reason', value: reason, inline: true}
                )
                .setColor('#FF2145')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while kicking the member.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}       