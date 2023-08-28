const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member for a specified duration')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option =>
        option.setName('user')
        .setDescription('The user you want to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Enter the reason for the mute")
        .setRequired(true)
    ),
    
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser("user");
        const reason = options.getString("reason") || 'No reason provided';

        try{
            const member = await interaction.guild.members.fetch(user.id);

            if(member.roles.highest.position >= interaction.member.roles.highest.position){
                const errEmbed = new EmbedBuilder()
                    .setDescription("You can not unmute users with a higher role than yours!")
                    .setColor("#FF2145");
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            await member.timeout(null);

            const embed = new EmbedBuilder()
                .setTitle(`Unmuted`)
                .setDescription(`${user.tag} has been unmuted`)
                .addFields(
                    {name: "Reason", value: reason, inline: true},
                )
                .setColor("#FF2145")
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription("An error occurred while unmuting the member.")
                .setColor("#FF2145");
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}
    