const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to ban')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for the ban')
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
                    .setDescription('You can not ban a member with a higher role than yours!')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            await member.ban({ reason: reason });

            const embed = new EmbedBuilder()
                .setTitle('Banned')
                .setDescription(`${user.tag} has been banned`)
                .addFields(
                    {name: 'Reason', value: reason, inline: true}
                )
                .setColor('#FF2145')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
        catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while banning the member.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}