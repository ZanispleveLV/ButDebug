const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout user')
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to timeout')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('The reason for timing them out')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
            .setDescription('How long they should be timed out for')
            .setRequired(true)
            .addChoices(
                { name: '2 mins', value: '2'},
                { name: '5 mins', value: '5'},
                { name: '1 hour', value: '60'},
                { name: '3 hour', value: '180'},
                { name: '1 day', value: '1440'},
                { name: '1 week', value: '10080'},
            )
        ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser('user');
        const reason = options.getString('reason');
        const duration = options.getString('duration');

        try{
            const member = await interaction.guild.members.fetch(user.id);

            if(member.roles.highest.position >= interaction.member.roles.highest.position){
                const errEmbed = new EmbedBuilder()
                    .setDescription('You can not mute users with a higher role than yours!')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }
    
            const timeout = parseInt(duration) * 60 * 1000;
            await member.timeout(timeout, reason);

            const embed = new EmbedBuilder()
                .setTitle(`Muted`)
                .setDescription(`${user.tag} has been timed out`)
                .addFields(
                    {name: 'Reason', value: reason, inline: true},
                    {name: 'Duration', value:`${duration} minutes`, inline: true}
                )
                .setColor('#FF2145')
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while muting the member.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}