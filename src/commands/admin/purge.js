const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The amount of messages to delete')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        ),

    async execute(interaction){
        const {channel, options} = interaction;

        const amount  = options.getInteger("amount");

        try{
            if(amount < 1 || amount > 100){
                const errEmbed = new EmbedBuilder()
                    .setDescription("You can not purge messages!")
                    .setColor("#FF2145");
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            await interaction.channel.bulkDelete(amount, true)

            const embed = new EmbedBuilder()
                .setTitle("Delete")
                .setDescription(`Succesfuly deleted ${amount} messages`)
                .setColor("#FF2145")
                .setTimestamp();
            interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                interaction.channel.bulkDelete(1, true);
            }, 2000);

        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription("An error occurred while purging the messages.")
                .setColor("#FF2145");
            interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }
    }
}